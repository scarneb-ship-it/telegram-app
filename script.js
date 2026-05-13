// ==================== КОНФИГУРАЦИЯ ====================
const BOT_USERNAME = 'khadron_bot';
let currentUserId = null;

// Заглушка для отправки статистики (не используется на GitHub Pages)
function sendUserStat(user) {
    // Для бесплатного хостинга без сервера статистика отключена
    console.log('User stat (disabled):', user?.id);
}

// ==================== ДАННЫЕ ====================
const GAMES_DATA = [
    {
        id: 0,
        name: "Pixel World",
        fullLink: "https://t.me/pixelworld/play?startapp=r6823288584",
        description: "Первый 3D-шутер в Telegram",
        rating: 4.9,
        players: "34K",
        image: "images/photo_2026-02-17_13-44-55.jpg",
        fallback: "🌍",
        badge: "Beta",
        highlight: true
    },
    {
        id: 1,
        name: "Hamster GameDev",
        fullLink: "https://t.me/Hamster_GAme_Dev_bot/start?startapp=kentId6823288584",
        description: "Создай свою студию",
        rating: 4.7,
        players: "368K",
        image: "images/hamster-gamedev.jpg",
        fallback: "🎮"
    },
    {
        id: 2,
        name: "Hamster King",
        fullLink: "https://t.me/hamsterking_game_bot?startapp=6823288584",
        description: "Стань королем хомяков",
        rating: 4.2,
        players: "188K",
        image: "images/hamster-king.jpg",
        fallback: "👑"
    },
    {
        id: 3,
        name: "Hamster Fight Club",
        fullLink: "https://t.me/hamster_fightclub_bot?startapp=NWE1YjA2YWUtZTAyMS01ZjA1LTg4ZTYtMGZmZjUwNDQwNjU5",
        description: "Бойцовский клуб хомяков",
        rating: 4.9,
        players: "85K",
        image: "images/hamster-fightclub.jpg",
        fallback: "🥊"
    },
    {
        id: 4,
        name: "BitQuest",
        fullLink: "https://t.me/BitquestGameSBot/start?startapp=kentId_6823288584",
        description: "Приключения в мире крипты",
        rating: 3.8,
        players: "281K",
        image: "images/bitquest.jpg",
        fallback: "💰"
    }
];

const EXCHANGES_DATA = [
    { id: 1, name: "Bybit", url: "https://www.bybit.com/invite?ref=57KXPMO", description: "Продвинутая торговая платформа", image: "images/bybit.jpg", fallback: "💱" },
    { id: 2, name: "BingX", url: "https://bingxdao.com/referral-program/V2TZVA?activityId=g_1529293499868241925", description: "Социальная торговля и копирование", image: "images/bingx.jpg", fallback: "📈" },
    { id: 3, name: "Bitget", url: "https://www.bitgetapps.com/ru/referral/register?clacCode=40FSP70H&from=%2Fru%2Fevents%2Freferral-all-program&source=events&utmSource=PremierInviter", description: "Инновационная торговая платформа", image: "images/bitget.jpg", fallback: "⚡" },
    { id: 4, name: "MEXC", url: "https://promote.mexc.com/r/aTSLfdm54W", description: "Глобальная биржа с низкими комиссиями", image: "images/mexc.jpg", fallback: "🌍" }
];

const translations = {
    ru: {
        appTitle: "Games Verse", settings: "Настройки", theme: "Тема", lightTheme: "Светлая", darkTheme: "Тёмная",
        language: "Язык", russian: "Русский", english: "English", done: "Готово", games: "Игры",
        bestGames: "Лучшие игры Telegram", play: "Играть", exchanges: "Биржи", exchangesDesc: "Торгуйте криптовалютами безопасно",
        user: "Пользователь", shareWithFriends: "Поделиться с друзьями", profile: "Профиль", linkCopied: "Ссылка скопирована!",
        go: "Перейти", game2048: "2048", score: "Счёт", best: "Лучший", newGame: "Новая игра",
        swipeHint: "👆 Свайпайте пальцем или используйте стрелки", gameWin: "Вы победили! 🎉",
        gameLose: "Игра окончена! 😔", inviteTitle: "Вы проиграли! 🥺", inviteText: "Пригласите друга в Telegram, чтобы отменить последний ход и продолжить игру.",
        inviteYes: "Пригласить друга", inviteNo: "Новая игра", undoSucceed: "Ход отменён! Игра продолжается."
    },
    en: {
        appTitle: "Games Verse", settings: "Settings", theme: "Theme", lightTheme: "Light", darkTheme: "Dark",
        language: "Language", russian: "Russian", english: "English", done: "Done", games: "Games",
        bestGames: "Best Telegram Games", play: "Play", exchanges: "Exchanges", exchangesDesc: "Trade cryptocurrencies safely",
        user: "User", shareWithFriends: "Share with friends", profile: "Profile", linkCopied: "Link copied!",
        go: "Go", game2048: "2048", score: "Score", best: "Best", newGame: "New Game",
        swipeHint: "👆 Swipe or use arrow keys", gameWin: "You win! 🎉",
        gameLose: "Game over! 😔", inviteTitle: "You lost! 🥺", inviteText: "Invite a friend on Telegram to undo the last move and keep playing.",
        inviteYes: "Invite Friend", inviteNo: "New Game", undoSucceed: "Move undone! Keep playing."
    }
};

// ==================== УТИЛИТЫ ====================
function vibrate() { if (navigator.vibrate) navigator.vibrate(50); }
function getTranslation(key) {
    const lang = localStorage.getItem('language') || 'ru';
    return translations[lang]?.[key] || key;
}
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang]?.[key]) el.textContent = translations[lang][key];
    });
    // Обновление модального окна, если открыто
    const modal = document.getElementById('invite-modal');
    if (modal?.classList.contains('active')) {
        document.getElementById('invite-title').textContent = translations[lang].inviteTitle;
        document.getElementById('invite-text').textContent = translations[lang].inviteText;
        document.getElementById('invite-yes').textContent = translations[lang].inviteYes;
        document.getElementById('invite-no').textContent = translations[lang].inviteNo;
    }
}

// ==================== TELEGRAM ИНИЦИАЛИЗАЦИЯ ====================
function initializeTelegramWebApp() {
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        // Применяем цвета темы Telegram, если доступны
        const themeParams = tg.themeParams;
        if (themeParams) {
            document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color || '#000000');
            document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color || '#2481cc');
            document.documentElement.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color || '#ffffff');
        }
    }
}

// ==================== ПОЛЬЗОВАТЕЛЬ ====================
function loadUserData() {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        currentUserId = user.id;
        updateProfile(user);
        sendUserStat(user);
    } else {
        document.getElementById('user-name').textContent = 'Guest';
        document.getElementById('user-username').textContent = 'Open in Telegram';
        document.getElementById('avatar-fallback').textContent = 'G';
    }
}

function updateProfile(user) {
    document.getElementById('user-name').textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    document.getElementById('user-username').textContent = user.username ? '@' + user.username : '';
    const avatarImg = document.getElementById('avatar-img');
    const avatarFallback = document.getElementById('avatar-fallback');
    if (user.photo_url) {
        avatarImg.src = user.photo_url;
        avatarImg.style.display = 'block';
        avatarFallback.style.display = 'none';
    } else {
        avatarImg.style.display = 'none';
        avatarFallback.textContent = (user.first_name || 'T').charAt(0).toUpperCase();
        avatarFallback.style.display = 'flex';
    }
}

// ==================== КАРТОЧКИ ИГР/БИРЖ ====================
function generateStars(rating) {
    const full = Math.floor(rating);
    let html = '';
    for (let i = 0; i < full; i++) html += '<span class="star filled">★</span>';
    for (let i = full; i < 5; i++) html += '<span class="star">★</span>';
    return html;
}

function renderGames() {
    const container = document.getElementById('games-grid');
    container.innerHTML = GAMES_DATA.map(game => `
        <div class="game-card ${game.highlight ? 'highlight' : ''}" data-game-id="${game.id}">
            <div class="game-image">
                <img src="${game.image}" alt="${game.name}" class="game-img" onerror="this.style.display='none'">
                <div class="image-fallback">${game.fallback}</div>
            </div>
            <div class="game-info">
                <div class="game-header">
                    <h3>${game.name}</h3>
                    ${game.badge ? `<span class="game-badge">${game.badge}</span>` : ''}
                </div>
                <p class="game-description">${game.description}</p>
                <div class="game-stats">
                    <div class="rating">
                        <div class="stars">${generateStars(game.rating)}</div>
                        <span class="rating-value">${game.rating}</span>
                    </div>
                    <div class="players">
                        <span>👥</span>
                        <span class="players-count">${game.players}</span>
                    </div>
                </div>
            </div>
            <button class="play-button" data-link="${game.fullLink}">${getTranslation('play')}</button>
        </div>
    `).join('');
}

function renderExchanges() {
    const container = document.getElementById('exchanges-list');
    container.innerHTML = EXCHANGES_DATA.map(ex => `
        <div class="exchange-card">
            <div class="exchange-logo">
                <img src="${ex.image}" alt="${ex.name}" class="exchange-img" onerror="this.style.display='none'">
                <div class="image-fallback">${ex.fallback}</div>
            </div>
            <div class="exchange-info">
                <h3>${ex.name}</h3>
                <p>${ex.description}</p>
            </div>
            <button class="exchange-button" data-url="${ex.url}">${getTranslation('go')}</button>
        </div>
    `).join('');
}

// ==================== НАВИГАЦИЯ ====================
function attachNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const header = document.querySelector('.header');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            vibrate();
            const target = item.dataset.section;
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            // Скрываем header на странице профиля
            header.style.display = (target === 'profile-section') ? 'none' : 'block';
        });
    });
}

// ==================== КНОПКИ ДЕЙСТВИЙ ====================
function openLink(url) {
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openLink(url);
    } else {
        window.open(url, '_blank');
    }
}

function attachGameButtons() {
    document.querySelectorAll('.play-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            vibrate();
            const link = btn.dataset.link;
            if (link) openLink(link);
        });
    });
}

function attachExchangeButtons() {
    document.querySelectorAll('.exchange-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            vibrate();
            const url = btn.dataset.url;
            if (url) openLink(url);
        });
    });
}

// ==================== SHARE ====================
function setupShare() {
    const shareBtn = document.getElementById('share-friends-button');
    shareBtn.addEventListener('click', () => {
        vibrate();
        const url = currentUserId
            ? `https://t.me/${BOT_USERNAME}?start=ref_${currentUserId}`
            : `https://t.me/${BOT_USERNAME}`;
        const text = 'Играй в лучшие мини-игры Telegram вместе с HADRON! 🎮';
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
        } else if (navigator.share) {
            navigator.share({ title: 'Games Verse', text, url }).catch(() => copyToClipboard(url));
        } else {
            copyToClipboard(url);
        }
    });
}

function copyToClipboard(text) {
    navigator.clipboard?.writeText(text).then(() => showNotification()).catch(() => {
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showNotification();
    });
}

function showNotification() {
    const el = document.getElementById('notification');
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2000);
}

// ==================== SETTINGS ====================
function setupSettings() {
    const panel = document.getElementById('settings-panel');
    document.getElementById('settings-button').addEventListener('click', () => panel.classList.add('active'));
    document.getElementById('close-settings').addEventListener('click', () => panel.classList.remove('active'));
    panel.querySelector('.settings-backdrop').addEventListener('click', () => panel.classList.remove('active'));

    // Theme
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const theme = opt.dataset.theme;
            document.body.classList.toggle('dark-theme', theme === 'dark');
            localStorage.setItem('theme', theme);
            themeOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        });
    });

    // Language
    const langOptions = document.querySelectorAll('.language-option');
    langOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const lang = opt.dataset.lang;
            setLanguage(lang);
            langOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        });
    });

    // Восстановить сохранённые настройки
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    document.querySelector(`.theme-option[data-theme="${savedTheme}"]`)?.classList.add('active');
    const savedLang = localStorage.getItem('language') || 'ru';
    setLanguage(savedLang);
    document.querySelector(`.language-option[data-lang="${savedLang}"]`)?.classList.add('active');
}

// ==================== 2048 GAME ====================
class Game2048 {
    constructor(boardElement, scoreElement, bestScoreElement, statusElement) {
        this.board = boardElement;
        this.scoreEl = scoreElement;
        this.bestEl = bestScoreElement;
        this.statusEl = statusElement;
        this.size = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('best2048')) || 0;
        this.history = [];
        this.maxHistory = 5;
        this.audioCtx = null;
        this.audioReady = false;
        this.inviteModal = document.getElementById('invite-modal');
        this.init();
        this.setupEvents();
        this.setupInviteModal();
    }

    initAudio() {
        if (this.audioReady) return;
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.audioReady = true;
        } catch(e) { console.log('Audio not supported'); }
    }

    playSound(freq, dur, type='sine', vol=0.15) {
        if (!this.audioReady) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + dur);
        osc.connect(gain); gain.connect(this.audioCtx.destination);
        osc.start(); osc.stop(this.audioCtx.currentTime + dur);
    }

    setupEvents() {
        let startX, startY;
        this.board.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            e.preventDefault();
        });
        this.board.addEventListener('touchend', e => {
            if (!startX) return;
            const dx = e.changedTouches[0].clientX - startX;
            const dy = e.changedTouches[0].clientY - startY;
            if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
            this.initAudio();
            if (Math.abs(dx) > Math.abs(dy)) this.move(dx > 0 ? 'right' : 'left');
            else this.move(dy > 0 ? 'down' : 'up');
            startX = null;
            vibrate();
        });
        window.addEventListener('keydown', e => {
            if (!document.querySelector('#profile-section.active')) return;
            const keys = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' };
            if (keys[e.key]) {
                e.preventDefault();
                this.initAudio();
                this.move(keys[e.key]);
                vibrate();
            }
        });
    }

    setupInviteModal() {
        document.getElementById('invite-yes').onclick = () => {
            const url = currentUserId ? `https://t.me/${BOT_USERNAME}?start=ref_${currentUserId}` : `https://t.me/${BOT_USERNAME}`;
            openLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Играем в 2048!')}`);
            this.hideInviteModal();
            setTimeout(() => {
                this.undoLastMove();
                this.playSound(800, 0.1, 'sine', 0.1);
            }, 1200);
        };
        document.getElementById('invite-no').onclick = () => {
            this.hideInviteModal();
            this.resetGame();
        };
        this.inviteModal.addEventListener('click', e => { if (e.target === this.inviteModal) this.hideInviteModal(); });
    }

    showInviteModal() {
        this.inviteModal.classList.add('active');
        const lang = localStorage.getItem('language') || 'ru';
        document.getElementById('invite-title').textContent = translations[lang].inviteTitle;
        document.getElementById('invite-text').textContent = translations[lang].inviteText;
        document.getElementById('invite-yes').textContent = translations[lang].inviteYes;
        document.getElementById('invite-no').textContent = translations[lang].inviteNo;
    }

    hideInviteModal() { this.inviteModal.classList.remove('active'); }

    undoLastMove() {
        if (this.history.length === 0) return;
        const prev = this.history.pop();
        this.grid = prev.grid;
        this.score = prev.score;
        this.updateScore();
        this.renderBoard();
        this.statusEl.textContent = getTranslation('undoSucceed');
    }

    init() {
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.history = [];
        this.updateScore();
        this.addRandomTile();
        this.addRandomTile();
        this.renderBoard();
    }

    addRandomTile() {
        const cells = [];
        for (let i=0;i<this.size;i++) for (let j=0;j<this.size;j++) if (this.grid[i][j]===0) cells.push({x:i,y:j});
        if (cells.length) {
            const {x,y} = cells[Math.floor(Math.random()*cells.length)];
            this.grid[x][y] = Math.random()<0.9 ? 2:4;
            return true;
        }
        return false;
    }

    renderBoard() {
        this.board.innerHTML = '';
        for (let i=0;i<this.size;i++) {
            for (let j=0;j<this.size;j++) {
                const v = this.grid[i][j];
                const tile = document.createElement('div');
                tile.className = 'tile-cell';
                if (v) {
                    tile.className += ` tile-${v}`;
                    if (v > 2048) tile.className += ' tile-super';
                    tile.textContent = v;
                }
                this.board.appendChild(tile);
            }
        }
    }

    updateScore() {
        this.scoreEl.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('best2048', this.bestScore);
            this.bestEl.textContent = this.bestScore;
        }
    }

    slide(row) {
        let arr = row.filter(v=>v!==0);
        let newRow = [];
        let gain = 0, merged = false;
        for (let i=0;i<arr.length;i++) {
            if (i+1<arr.length && arr[i]===arr[i+1]) {
                let val = arr[i]*2;
                newRow.push(val);
                gain += val;
                merged = true;
                i++;
            } else newRow.push(arr[i]);
        }
        while (newRow.length<this.size) newRow.push(0);
        return {newRow, gain, merged};
    }

    move(dir) {
        const oldGrid = this.grid.map(row => [...row]);
        let gain = 0, anyMerge = false;
        const processLine = (line, reverse) => {
            let arr = reverse ? [...line].reverse() : [...line];
            let res = this.slide(arr);
            if (reverse) res.newRow.reverse();
            gain += res.gain;
            if (res.merged) anyMerge = true;
            return res.newRow;
        };

        if (dir==='left') for (let i=0;i<4;i++) this.grid[i] = processLine(this.grid[i]);
        else if (dir==='right') for (let i=0;i<4;i++) this.grid[i] = processLine(this.grid[i], true);
        else if (dir==='up') for (let j=0;j<4;j++) { let col = []; for (let i=0;i<4;i++) col.push(this.grid[i][j]); col = processLine(col); for (let i=0;i<4;i++) this.grid[i][j]=col[i]; }
        else if (dir==='down') for (let j=0;j<4;j++) { let col = []; for (let i=0;i<4;i++) col.push(this.grid[i][j]); col = processLine(col, true); for (let i=0;i<4;i++) this.grid[i][j]=col[i]; }

        let changed = false;
        for (let i=0;i<4;i++) for (let j=0;j<4;j++) if (oldGrid[i][j]!==this.grid[i][j]) changed=true;
        if (!changed) return;

        // save history
        if (this.history.length >= this.maxHistory) this.history.shift();
        this.history.push({grid: oldGrid, score: this.score});

        if (gain) { this.score += gain; this.updateScore(); }
        this.addRandomTile();
        this.renderBoard();

        if (anyMerge) this.playSound(660, 0.12, 'triangle', 0.15);
        else this.playSound(440, 0.08, 'sine', 0.1);

        if (this.checkWin()) {
            this.statusEl.textContent = getTranslation('gameWin');
            this.playSound(523, 0.15); setTimeout(()=>this.playSound(659,0.15),150);
        } else if (this.checkLose()) {
            this.statusEl.textContent = getTranslation('gameLose');
            this.playSound(200, 0.3, 'sawtooth', 0.12);
            this.showInviteModal();
        }
    }

    checkWin() { return this.grid.flat().includes(2048); }
    checkLose() {
        for (let i=0;i<4;i++) for (let j=0;j<4;j++) {
            if (this.grid[i][j]===0) return false;
            if (j<3 && this.grid[i][j]===this.grid[i][j+1]) return false;
            if (i<3 && this.grid[i][j]===this.grid[i+1][j]) return false;
        }
        return true;
    }

    resetGame() { this.init(); this.renderBoard(); this.statusEl.textContent = ''; }
}

let gameInstance = null;
function initGame() {
    if (gameInstance) return;
    const board = document.getElementById('game-board-2048');
    const scoreEl = document.getElementById('game-score');
    const bestEl = document.getElementById('best-score');
    const statusEl = document.getElementById('game-status');
    if (board && scoreEl && bestEl && statusEl) {
        gameInstance = new Game2048(board, scoreEl, bestEl, statusEl);
        document.getElementById('new-game-btn').addEventListener('click', () => { vibrate(); gameInstance.resetGame(); });
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
function main() {
    initializeTelegramWebApp();
    attachNavigation();
    renderGames();
    attachGameButtons();
    renderExchanges();
    attachExchangeButtons();
    loadUserData();
    setupShare();
    setupSettings();
    initGame();

    // Убираем splash
    const splash = document.getElementById('splash-screen');
    splash.classList.add('hidden');
    setTimeout(() => splash.remove(), 500);

    // Следим за переключением на профиль, чтобы инициализировать игру при первом заходе
    const observer = new MutationObserver(() => {
        if (document.getElementById('profile-section')?.classList.contains('active')) {
            initGame();
        }
    });
    observer.observe(document.querySelector('.main-content'), { attributes: true, subtree: true });
}

document.addEventListener('DOMContentLoaded', main);
