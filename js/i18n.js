// Internationalization Module
//
// Loaded before every other game module: everything else calls I18n.t() at
// render time, so the language can change without a reload.
//
// A language pack is a plain nested object registered by js/locales/<code>.js.
// Lookups walk the current pack, fall back to English, and fall back again to
// the key itself, so a half-finished pack degrades to English instead of blank
// UI.
//
// Static markup is translated declaratively: any element carrying data-i18n
// (or data-i18n-html / -placeholder / -value / -title) is rewritten by
// I18n.apply(). Screens that build their text in JavaScript re-render through
// the change listeners registered with I18n.onChange().

const I18n = {
    LANGUAGES: [
        { code: 'en', label: 'English',          short: 'EN' },
        { code: 'ru', label: 'Русский',          short: 'RU' },
        { code: 'zh', label: '中文',              short: 'ZH' },
        { code: 'id', label: 'Bahasa Indonesia', short: 'ID' }
    ],

    FALLBACK: 'en',
    STORAGE_KEY: 'arcman_language',

    current: 'en',
    packs: {},
    listeners: [],

    // --- pack registration ------------------------------------------------

    register: function (code, pack) {
        this.packs[code] = pack;
    },

    isSupported: function (code) {
        return this.LANGUAGES.some(lang => lang.code === code);
    },

    languageLabel: function (code) {
        const lang = this.LANGUAGES.find(l => l.code === code);
        return lang ? lang.label : code;
    },

    // --- startup ----------------------------------------------------------

    // Stored choice wins; otherwise the browser's own language decides, so a
    // first-time Russian or Chinese player never has to find the switcher.
    detect: function () {
        let stored = null;
        try {
            stored = localStorage.getItem(this.STORAGE_KEY);
        } catch (e) {
            stored = null;
        }
        if (stored && this.isSupported(stored)) return stored;

        const candidates = (typeof navigator !== 'undefined' && navigator.languages)
            ? navigator.languages
            : [(typeof navigator !== 'undefined' && navigator.language) || ''];

        for (const raw of candidates) {
            const tag = String(raw || '').toLowerCase();
            if (tag.startsWith('ru')) return 'ru';
            if (tag.startsWith('zh')) return 'zh';
            if (tag.startsWith('id') || tag.startsWith('in')) return 'id';
            if (tag.startsWith('en')) return 'en';
        }
        return this.FALLBACK;
    },

    init: function () {
        this.current = this.detect();
        this.applyDocumentLanguage();
        this.apply();
        return this.current;
    },

    setLanguage: function (code) {
        if (!this.isSupported(code) || code === this.current) return;

        this.current = code;
        try {
            localStorage.setItem(this.STORAGE_KEY, code);
        } catch (e) {
            // Private browsing — the choice simply does not survive a reload.
        }

        this.applyDocumentLanguage();
        this.apply();
        this.listeners.forEach(fn => {
            try {
                fn(code);
            } catch (e) {
                console.error('Language listener failed:', e);
            }
        });
    },

    applyDocumentLanguage: function () {
        if (typeof document === 'undefined') return;
        document.documentElement.setAttribute('lang', this.current);
        // Drives the CJK-aware font stack in the stylesheet.
        document.documentElement.setAttribute('data-lang', this.current);
        const title = this.lookup('document.title', this.current);
        if (title) document.title = title;
    },

    onChange: function (fn) {
        if (typeof fn === 'function') this.listeners.push(fn);
    },

    // --- lookup -----------------------------------------------------------

    resolve: function (pack, key) {
        if (!pack) return undefined;
        let node = pack;
        for (const part of String(key).split('.')) {
            if (node === null || typeof node !== 'object') return undefined;
            node = node[part];
        }
        return node;
    },

    lookup: function (key, lang) {
        const value = this.resolve(this.packs[lang], key);
        return typeof value === 'undefined' ? undefined : value;
    },

    // t('quizUi.incorrect', { answer: '…' }) — {name} placeholders are filled
    // from params. Missing keys return the key so a gap is visible, not silent.
    t: function (key, params) {
        let value = this.lookup(key, this.current);
        if (typeof value === 'undefined') value = this.lookup(key, this.FALLBACK);
        if (typeof value === 'undefined') return key;
        if (typeof value !== 'string') return value;
        if (!params) return value;

        return value.replace(/\{(\w+)\}/g, (match, name) => (
            Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match
        ));
    },

    // --- game content -----------------------------------------------------
    //
    // Levels, info screens and quizzes keep their English source in levels.js /
    // infoScreens.js / quizzes.js / rescueTopics.js — only the wording is
    // translated here, so ids, correctIndex and level geometry stay in one
    // place.

    levelName: function (level) {
        if (!level) return '';
        const translated = this.lookup('levels.' + level.id, this.current);
        return typeof translated === 'string' ? translated : (level.name || '');
    },

    infoText: function (info) {
        if (!info) return '';
        const translated = this.lookup('info.' + info.id, this.current);
        return typeof translated === 'string' ? translated : (info.text || '');
    },

    // Returns { question, answers } — always three answers, in source order,
    // so correctIndex keeps pointing at the right one.
    quiz: function (quiz) {
        if (!quiz) return null;
        const translated = this.lookup('quiz.' + quiz.id, this.current);
        if (!translated || typeof translated !== 'object') {
            return { question: quiz.question, answers: quiz.answers };
        }
        return {
            question: translated.question || quiz.question,
            answers: quiz.answers.map((answer, i) => (
                (translated.answers && translated.answers[i]) || answer
            ))
        };
    },

    // Returns { title, hint, questions: [{ question, answers, correctIndex }] }
    rescueTopic: function (topic) {
        if (!topic) return null;
        const translated = this.lookup('rescueTopics.' + topic.id, this.current);
        if (!translated || typeof translated !== 'object') return topic;

        return {
            id: topic.id,
            title: translated.title || topic.title,
            hint: translated.hint || topic.hint,
            questions: topic.questions.map((q, i) => {
                const tq = translated.questions && translated.questions[i];
                if (!tq) return q;
                return {
                    question: tq.question || q.question,
                    answers: q.answers.map((answer, j) => (tq.answers && tq.answers[j]) || answer),
                    correctIndex: q.correctIndex
                };
            })
        };
    },

    // 'Tournament' / 'Community' are contract values — translate the label only.
    gameModeLabel: function (mode) {
        if (!mode) return this.t('mode.unknown');
        const key = 'mode.' + String(mode).toLowerCase();
        const translated = this.lookup(key, this.current) || this.lookup(key, this.FALLBACK);
        return translated || mode;
    },

    // --- declarative markup -----------------------------------------------

    apply: function (root) {
        if (typeof document === 'undefined') return;
        const scope = root || document;

        scope.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = this.t(el.getAttribute('data-i18n'));
        });
        scope.querySelectorAll('[data-i18n-html]').forEach(el => {
            el.innerHTML = this.t(el.getAttribute('data-i18n-html'));
        });
        scope.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
        });
        scope.querySelectorAll('[data-i18n-value]').forEach(el => {
            el.value = this.t(el.getAttribute('data-i18n-value'));
        });
        scope.querySelectorAll('[data-i18n-title]').forEach(el => {
            el.title = this.t(el.getAttribute('data-i18n-title'));
        });
    }
};

// Shorthand used across the game modules.
function t(key, params) {
    return I18n.t(key, params);
}

if (typeof window !== 'undefined') {
    window.I18n = I18n;
    window.t = t;
}

// Main-menu language dropdown.
//
// A native <select> cannot be styled to match the neon menu on every browser,
// so this is a button plus a listbox. Keyboard and click-away handling are done
// here rather than left to the browser.
const LanguageSwitcher = {
    root: null,
    button: null,
    label: null,
    list: null,
    focusIndex: 0,

    init: function () {
        this.root = document.getElementById('languageSwitcher');
        this.button = document.getElementById('languageToggle');
        this.label = document.getElementById('languageCurrentLabel');
        this.list = document.getElementById('languageList');
        if (!this.root || !this.button || !this.list) return;

        this.render();

        this.button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });
        this.button.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.open();
            }
        });

        this.list.addEventListener('click', (e) => {
            const item = e.target.closest('li[data-code]');
            if (!item) return;
            e.stopPropagation();
            this.choose(item.getAttribute('data-code'));
        });

        document.addEventListener('click', (e) => {
            if (this.isOpen() && !this.root.contains(e.target)) this.close();
        });
        document.addEventListener('keydown', (e) => this.onKeydown(e));

        I18n.onChange(() => this.render());
    },

    render: function () {
        if (!this.list) return;

        if (this.label) this.label.textContent = I18n.languageLabel(I18n.current);

        this.list.innerHTML = '';
        I18n.LANGUAGES.forEach((lang, i) => {
            const item = document.createElement('li');
            item.setAttribute('role', 'option');
            item.setAttribute('data-code', lang.code);
            item.setAttribute('aria-selected', lang.code === I18n.current ? 'true' : 'false');
            item.textContent = lang.label;
            if (lang.code === I18n.current) this.focusIndex = i;
            this.list.appendChild(item);
        });
    },

    isOpen: function () {
        return this.root && this.root.classList.contains('open');
    },

    open: function () {
        if (!this.root || this.isOpen()) return;
        this.root.classList.add('open');
        this.list.hidden = false;
        this.button.setAttribute('aria-expanded', 'true');
        this.highlight(I18n.LANGUAGES.findIndex(l => l.code === I18n.current));
    },

    close: function () {
        if (!this.root || !this.isOpen()) return;
        this.root.classList.remove('open');
        this.list.hidden = true;
        this.button.setAttribute('aria-expanded', 'false');
    },

    toggle: function () {
        if (this.isOpen()) this.close();
        else this.open();
    },

    highlight: function (index) {
        const items = Array.from(this.list.children);
        if (!items.length) return;
        this.focusIndex = (index + items.length) % items.length;
        items.forEach((item, i) => item.classList.toggle('focused', i === this.focusIndex));
    },

    onKeydown: function (e) {
        if (!this.isOpen()) return;

        if (e.key === 'Escape') {
            this.close();
            this.button.focus();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.highlight(this.focusIndex + 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.highlight(this.focusIndex - 1);
        } else if (e.key === 'Enter' || e.key === ' ') {
            const item = this.list.children[this.focusIndex];
            if (item) {
                e.preventDefault();
                this.choose(item.getAttribute('data-code'));
            }
        }
    },

    choose: function (code) {
        this.close();
        I18n.setLanguage(code);
        if (this.button) this.button.focus();
    }
};

if (typeof window !== 'undefined') {
    window.LanguageSwitcher = LanguageSwitcher;
}
