// Server-side quizzes.
//
// The browser gets the questions and the answer wording, never which answer is
// right. Grading happens here, against a private answer key that is deployed to
// the server like .env and never committed (the repository is public).
//
// Every quiz is bound to a game session:
//   - a level quiz can only be opened once the session has completed that level,
//     and answered once. Each level has several question variants; the server
//     picks one per session;
//   - the rescue quiz can be taken once per session, and asks three of its
//     topic's questions, picked by the server;
//   - answers are shuffled per session, so a list of "the right answer is B"
//     passed around between players does not work.
//
// The answer key stores the exact English text of each correct answer rather
// than its position. Reordering answers in the content keeps working; editing
// the wording of a correct answer without updating the key stops the quizzes
// from loading, loudly, instead of silently marking the wrong answer right.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const DEFAULT_KEY_PATH = path.join(ROOT, 'private', 'answer-key.json');

// Rescue: correct answers -> lives handed back. Mirrors the rules shown to players.
const RESCUE_REWARDS = { 3: 3, 2: 1 };
const RESCUE_QUESTIONS = 3;   // asked per rescue, out of the topic's pool

function shuffledOrder(length) {
    const order = Array.from({ length }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
        const j = crypto.randomInt(i + 1);
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
}

const pickDistinct = (count, from) => shuffledOrder(from).slice(0, count);

// Build the grading index from the content files and the private key, checking
// that they agree:
//   question:      { [questionId]: correctIndex }
//   levelVariants: { [level]: [questionId, ...] }
//   rescue:        { [topicId]: [correctIndex for each question in the pool] }
function loadAnswerIndex(keyPath) {
    const { QUIZZES } = require(path.join(ROOT, 'js', 'quizzes.js'));
    const { RESCUE_TOPICS } = require(path.join(ROOT, 'js', 'rescueTopics.js'));
    const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    const problems = [];

    const question = {};
    const answerCount = {};
    const levelVariants = {};
    for (const quiz of QUIZZES) {
        const text = key.level && key.level[String(quiz.id)];
        const index = quiz.answers.indexOf(text);
        if (index === -1) {
            problems.push(`quiz ${quiz.id}: key answer not among its answers`);
            continue;
        }
        question[quiz.id] = index;
        answerCount[quiz.id] = quiz.answers.length;
        (levelVariants[quiz.level] = levelVariants[quiz.level] || []).push(quiz.id);
    }

    const rescue = {};
    for (const topic of RESCUE_TOPICS) {
        const texts = key.rescue && key.rescue[topic.id];
        if (!Array.isArray(texts) || texts.length !== topic.questions.length) {
            problems.push(`rescue topic ${topic.id}: key needs ${topic.questions.length} answers`);
            continue;
        }
        const indexes = topic.questions.map((q, i) => q.answers.indexOf(texts[i]));
        indexes.forEach((idx, i) => {
            if (idx === -1) problems.push(`rescue topic ${topic.id} question ${i + 1}: key answer not among its answers`);
        });
        if (topic.questions.length < RESCUE_QUESTIONS) {
            problems.push(`rescue topic ${topic.id}: needs at least ${RESCUE_QUESTIONS} questions`);
        }
        rescue[topic.id] = indexes;
    }

    if (problems.length) {
        throw new Error('Answer key does not match the quiz content:\n  ' + problems.join('\n  '));
    }
    return {
        question,
        answerCount,
        levelVariants,
        rescue,
        rescueTopics: RESCUE_TOPICS.map(t => ({ id: t.id, questionCount: t.questions.length, answerCount: t.questions.map(q => q.answers.length) })),
    };
}

function registerQuizRoutes(app, { sessions, getIp, sessionExpiryMs, log = console }) {
    const keyPath = process.env.ANSWER_KEY_PATH || DEFAULT_KEY_PATH;
    let answers = null;
    try {
        answers = loadAnswerIndex(keyPath);
        const variants = Object.values(answers.levelVariants).reduce((n, list) => n + list.length, 0);
        const pool = answers.rescueTopics.reduce((n, t) => n + t.questionCount, 0);
        log.log(`Quizzes ready: ${variants} level questions over ${Object.keys(answers.levelVariants).length} levels, ${pool} rescue questions over ${answers.rescueTopics.length} topics`);
    } catch (error) {
        // The rest of the backend (sessions, score signing) keeps running;
        // quiz endpoints answer 503 and /api/health reports it.
        log.error(`QUIZZES UNAVAILABLE — ${error.code === 'ENOENT' ? `no answer key at ${keyPath}` : error.message}`);
    }

    // The last rescue topic drawn per IP, so a player starting over does not
    // get the same topic twice in a row.
    const lastRescueTopicByIp = new Map();

    // Shared guard: a live session, from the address that started it.
    function openSession(req, res) {
        if (!answers) {
            res.status(503).json({ error: 'Quizzes unavailable' });
            return null;
        }
        const { sessionId } = req.body || {};
        // A refused quiz reaches the player as "the quiz server did not answer",
        // which says nothing about why. These lines are what turn that into
        // something we can actually chase.
        const refuse = (status, error, detail) => {
            log.log(`Quiz refused (${error}${detail ? ': ' + detail : ''}) for session ${sessionId || 'none'}`);
            res.status(status).json({ error });
            return null;
        };

        const session = sessionId && sessions.get(sessionId);
        if (!session) {
            return refuse(404, 'Session not found', `${sessions.size} sessions held`);
        }
        if (session.ip !== getIp(req)) {
            return refuse(403, 'Session IP mismatch', `session ${session.ip}, request ${getIp(req)}`);
        }
        if (Date.now() - session.startTime > sessionExpiryMs) {
            return refuse(410, 'Session expired', `${Math.round((Date.now() - session.startTime) / 1000)}s old`);
        }
        if (session.finalized) {
            return refuse(400, 'Session already finalized');
        }
        session.quizzes = session.quizzes || {};
        return session;
    }

    const isChoice = (value, count) => Number.isInteger(value) && value >= 0 && value < count;

    // How many level questions this run has answered correctly. The game shows
    // it while there are still questions left, so nobody learns what skipping
    // cost them only after the last level.
    const correctSoFar = (session) =>
        Object.values(session.quizzes || {}).filter(quiz => quiz.answered && quiz.correct).length;

    // --- level quizzes ------------------------------------------------------

    app.post('/api/quiz/level/start', (req, res) => {
        const session = openSession(req, res);
        if (!session) return;

        const levelId = Number(req.body.levelId);
        if (!Number.isInteger(levelId) || !answers.levelVariants[levelId]) {
            return res.status(400).json({ error: 'Unknown level quiz' });
        }

        // Only a level this session actually completed opens its quiz
        const level = session.levels[levelId - 1];
        if (!level || !level.completedAt) {
            log.log(`Quiz refused (level ${levelId} not completed) for session ${req.body.sessionId}: `
                + `${session.levels.length} levels recorded, `
                + `${session.levels.filter(l => l && l.completedAt).length} of them finished`);
            return res.status(409).json({ error: 'Level not completed in this session' });
        }

        const existing = session.quizzes[levelId];
        if (existing && existing.answered) {
            return res.status(409).json({ error: 'Quiz already answered' });
        }
        // One variant per session, picked here; re-opening an unanswered quiz
        // returns the same question in the same order
        let quiz = existing;
        if (!quiz) {
            const variants = answers.levelVariants[levelId];
            const questionId = variants[crypto.randomInt(variants.length)];
            quiz = { questionId, order: shuffledOrder(answers.answerCount[questionId]), openedAt: Date.now(), answered: false };
            session.quizzes[levelId] = quiz;
        }
        res.json({ questionId: quiz.questionId, order: quiz.order, correctSoFar: correctSoFar(session) });
    });

    app.post('/api/quiz/level/answer', (req, res) => {
        const session = openSession(req, res);
        if (!session) return;

        const levelId = Number(req.body.levelId);
        const quiz = session.quizzes[levelId];
        if (!quiz) return res.status(409).json({ error: 'Quiz not opened' });
        if (quiz.answered) return res.status(409).json({ error: 'Quiz already answered' });

        const { choice } = req.body;
        if (!isChoice(choice, quiz.order.length)) {
            return res.status(400).json({ error: 'Invalid choice' });
        }

        const correctIndex = answers.question[quiz.questionId];
        const correct = quiz.order[choice] === correctIndex;
        Object.assign(quiz, { answered: true, correct, answeredAt: Date.now() });

        res.json({ correct, correctPosition: quiz.order.indexOf(correctIndex), correctSoFar: correctSoFar(session) });
    });

    // --- rescue quiz --------------------------------------------------------

    app.post('/api/quiz/rescue/start', (req, res) => {
        const session = openSession(req, res);
        if (!session) return;

        if (session.rescue && session.rescue.finished) {
            return res.status(409).json({ error: 'Rescue already used in this session' });
        }
        if (!session.rescue) {
            const ip = getIp(req);
            const previous = lastRescueTopicByIp.get(ip);
            const pool = answers.rescueTopics.filter(t => t.id !== previous);
            const list = pool.length ? pool : answers.rescueTopics;
            const topic = list[crypto.randomInt(list.length)];
            lastRescueTopicByIp.set(ip, topic.id);
            const questions = pickDistinct(RESCUE_QUESTIONS, topic.questionCount);
            session.rescue = {
                topicId: topic.id,
                questions,                                    // indexes into the topic's pool
                orders: questions.map(q => shuffledOrder(topic.answerCount[q])),
                results: [],
                finished: false,
                startedAt: Date.now(),
            };
        }
        const { topicId, questions, orders, results } = session.rescue;
        res.json({ topicId, questions, orders, answered: results.length });
    });

    app.post('/api/quiz/rescue/answer', (req, res) => {
        const session = openSession(req, res);
        if (!session) return;

        const rescue = session.rescue;
        if (!rescue) return res.status(409).json({ error: 'Rescue not started' });
        if (rescue.finished) return res.status(409).json({ error: 'Rescue already used in this session' });

        // Questions are answered in order, each exactly once
        const index = Number(req.body.index);
        if (index !== rescue.results.length) {
            return res.status(409).json({ error: 'Out-of-order answer' });
        }
        const order = rescue.orders[index];
        const { choice } = req.body;
        if (!isChoice(choice, order.length)) {
            return res.status(400).json({ error: 'Invalid choice' });
        }

        const correctIndex = answers.rescue[rescue.topicId][rescue.questions[index]];
        const correct = order[choice] === correctIndex;
        rescue.results.push(correct);

        const response = { correct, correctPosition: order.indexOf(correctIndex) };
        if (rescue.results.length === rescue.orders.length) {
            rescue.finished = true;
            const correctCount = rescue.results.filter(Boolean).length;
            rescue.lives = RESCUE_REWARDS[correctCount] || 0;
            Object.assign(response, { done: true, correctCount, lives: rescue.lives });
        }
        res.json(response);
    });

    return { isReady: () => answers !== null };
}

module.exports = { registerQuizRoutes, loadAnswerIndex, RESCUE_REWARDS, RESCUE_QUESTIONS };
