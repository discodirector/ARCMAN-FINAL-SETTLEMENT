// Server-side quizzes.
//
// The browser gets the questions and the answer wording, never which answer is
// right. Grading happens here, against a private answer key that is deployed to
// the server like .env and never committed (the repository is public).
//
// Every quiz is bound to a game session:
//   - a level quiz can only be opened once the session has completed that level,
//     and answered once;
//   - the rescue quiz can be taken once per session;
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

function shuffledOrder(length) {
    const order = Array.from({ length }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
        const j = crypto.randomInt(i + 1);
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
}

// Build { level: { [id]: correctIndex }, rescue: { [topicId]: [correctIndex x3] } }
// from the content files and the private key, checking that they agree.
function loadAnswerIndex(keyPath) {
    const { QUIZZES } = require(path.join(ROOT, 'js', 'quizzes.js'));
    const { RESCUE_TOPICS } = require(path.join(ROOT, 'js', 'rescueTopics.js'));
    const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    const problems = [];

    const level = {};
    for (const quiz of QUIZZES) {
        const text = key.level && key.level[String(quiz.id)];
        const index = quiz.answers.indexOf(text);
        if (index === -1) problems.push(`level quiz ${quiz.id}: key answer not among its answers`);
        else level[quiz.id] = index;
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
        rescue[topic.id] = indexes;
    }

    if (problems.length) {
        throw new Error('Answer key does not match the quiz content:\n  ' + problems.join('\n  '));
    }
    return {
        level,
        rescue,
        levelAnswerCount: Object.fromEntries(QUIZZES.map(q => [q.id, q.answers.length])),
        rescueTopics: RESCUE_TOPICS.map(t => ({ id: t.id, questionCount: t.questions.length, answerCount: t.questions.map(q => q.answers.length) })),
    };
}

function registerQuizRoutes(app, { sessions, getIp, sessionExpiryMs, log = console }) {
    const keyPath = process.env.ANSWER_KEY_PATH || DEFAULT_KEY_PATH;
    let answers = null;
    try {
        answers = loadAnswerIndex(keyPath);
        log.log(`Quizzes ready: ${Object.keys(answers.level).length} level quizzes, ${answers.rescueTopics.length} rescue topics`);
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
        const session = sessionId && sessions.get(sessionId);
        if (!session) {
            res.status(404).json({ error: 'Session not found' });
            return null;
        }
        if (session.ip !== getIp(req)) {
            res.status(403).json({ error: 'Session IP mismatch' });
            return null;
        }
        if (Date.now() - session.startTime > sessionExpiryMs) {
            res.status(410).json({ error: 'Session expired' });
            return null;
        }
        if (session.finalized) {
            res.status(400).json({ error: 'Session already finalized' });
            return null;
        }
        session.quizzes = session.quizzes || {};
        return session;
    }

    const isChoice = (value, count) => Number.isInteger(value) && value >= 0 && value < count;

    // --- level quizzes ------------------------------------------------------

    app.post('/api/quiz/level/start', (req, res) => {
        const session = openSession(req, res);
        if (!session) return;

        const levelId = Number(req.body.levelId);
        if (!Number.isInteger(levelId) || !(levelId in answers.level)) {
            return res.status(400).json({ error: 'Unknown level quiz' });
        }

        // Only a level this session actually completed opens its quiz
        const level = session.levels[levelId - 1];
        if (!level || !level.completedAt) {
            return res.status(409).json({ error: 'Level not completed in this session' });
        }

        const existing = session.quizzes[levelId];
        if (existing && existing.answered) {
            return res.status(409).json({ error: 'Quiz already answered' });
        }
        // Re-opening an unanswered quiz returns the same order
        const quiz = existing || { order: shuffledOrder(answers.levelAnswerCount[levelId]), openedAt: Date.now(), answered: false };
        session.quizzes[levelId] = quiz;
        res.json({ order: quiz.order });
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

        const correctIndex = answers.level[levelId];
        const correct = quiz.order[choice] === correctIndex;
        Object.assign(quiz, { answered: true, correct, answeredAt: Date.now() });

        res.json({ correct, correctPosition: quiz.order.indexOf(correctIndex) });
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
            session.rescue = {
                topicId: topic.id,
                orders: topic.answerCount.map(count => shuffledOrder(count)),
                results: [],
                finished: false,
                startedAt: Date.now(),
            };
        }
        const { topicId, orders, results } = session.rescue;
        res.json({ topicId, orders, answered: results.length });
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

        const correctIndex = answers.rescue[rescue.topicId][index];
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

module.exports = { registerQuizRoutes, loadAnswerIndex, RESCUE_REWARDS };
