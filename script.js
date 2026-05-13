// ==================== КОНФИГУРАЦИЯ ====================
const BOT_USERNAME = 'khadron_bot';
let currentUserId = null;
const WORKER_URL = 'https://misty-poetry-f4b2.scarneb.workers.dev/';

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
    {
        id: 1,
        name: "Bybit",
        url: "https://www.bybit.com/invite?ref=57KXPMO",
        description: "Продвинутая торговая платформа",
        image: "images/bybit.jpg",
        fallback: "💱"
    },
    {
        id: 2,
        name: "BingX",
        url: "https://bingxdao.com/referral-program/V2TZVA?activityId=g_1529293499868241925",
        description: "Социальная торговля и копирование",
        image: "images/bingx.jpg",
        fallback: "📈"
    },
    {
        id: 3,
        name: "Bitget",
        url: "https://www.bitgetapps.com/ru/referral/register?clacCode=40FSP70H&from=%2Fru%2Fevents%2Freferral-all-program&source=events&utmSource=PremierInviter",
        description: "Инновационная торговая платформа",
        image: "images/bitget.jpg",
        fallback: "⚡"
    },
    {
        id: 4,
        name: "MEXC",
        url: "https://promote.mexc.com/r/aTSLfdm54W",
        description: "Глобальная биржа с низкими комиссиями",
        image: "images/mexc.jpg",
        fallback: "🌍"
    }
];

// ==================== ПЕРЕВОДЫ ====================
const translations = {
    ru: {
        appTitle: "Games Verse",
        settings: "Настройки",
        theme: "Тема",
        lightTheme: "Светлая",
        darkTheme: "Темная",
        language: "Язык",
        russian: "Русский",
        english: "English",
        done: "Готово",
        games: "Игры",
        bestGames: "Лучшие игры Telegram",
        play: "Играть",
        exchanges: "Биржи",
        exchangesDesc: "Торгуйте криптовалютами безопасно",
        user: "Пользователь",
        shareWithFriends: "Поделиться с друзьями",
        profile: "Профиль",
        linkCopied: "Ссылка скопирована в буфер обмена!",
        go: "Перейти",
        game2048: "2048",
        score: "Счёт",
        best: "Лучший",
        newGame: "Новая игра",
        swipeHint: "👆 Свайпайте пальцем или используйте стрелки",
        gameWin: "Вы победили! 🎉",
        gameLose: "Игра окончена! 😔",
        inviteTitle: "Вы проиграли! 🥺",
        inviteText: "Пригласите друга в Telegram, чтобы отменить последний ход и продолжить игру.",
        inviteYes: "Пригласить друга",
        inviteNo: "Новая игра",
        undoSucceed: "Ход отменён! Игра продолжается.",
        undoSound: "Звук отмены",
        dailyTask: "Ежедневное задание",
        taskDone: "Задание выполнено! Так держать!"
    },
    en: {
        appTitle: "Games Verse",
        settings: "Settings",
        theme: "Theme",
        lightTheme: "Light",
        darkTheme: "Dark",
        language: "Language",
        russian: "Russian",
        english: "English",
        done: "Done",
        games: "Games",
        bestGames: "Best Telegram Games",
        play: "Play",
        exchanges: "Exchanges",
        exchangesDesc: "Trade cryptocurrencies safely",
        user: "User",
        shareWithFriends: "Share with friends",
        profile: "Profile",
        linkCopied: "Link copied to clipboard!",
        go: "Go",
        game2048: "2048",
        score: "Score",
        best: "Best",
        newGame: "New Game",
        swipeHint: "👆 Swipe or use arrow keys",
        gameWin: "You win! 🎉",
        gameLose: "Game over! 😔",
        inviteTitle: "You lost! 🥺",
        inviteText: "Invite a friend on Telegram to undo the last move and keep playing.",
        inviteYes: "Invite Friend",
        inviteNo: "New Game",
        undoSucceed: "Move undone! Keep playing.",
        undoSound: "Undo sound",
        dailyTask: "Daily Task",
        taskDone: "Task completed! Well done!"
    }
};

// ==================== ТЕЛЕГРАМ ИНИЦИАЛИЗАЦИЯ ====================
let tgWebApp = null;
let telegramCloudStorage = null;

function initTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
        tgWebApp = window.Telegram.WebApp;
        tgWebApp.ready();
        tgWebApp.expand();
        telegramCloudStorage = tgWebApp.CloudStorage;
        const themeParams = tgWebApp.themeParams;
        if (themeParams) {
            if (themeParams.bg_color) document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
            if (themeParams.text_color) document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color);
            if (themeParams.button_color) document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color);
            if (themeParams.button_text_color) document.documentElement.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color);
        }
        console.log('✅ Telegram WebApp инициализирован');
    } else {
        console.log('⚠️ Telegram WebApp недоступен');
    }
}

// ==================== ВИБРАЦИЯ С ПАТТЕРНАМИ ====================
function vibrate(pattern = 50) {
    if (navigator.vibrate) navigator.vibrate(pattern);
}

// ==================== ОБЛАЧНОЕ ХРАНИЛИЩЕ ====================
async function cloudSet(key, value) {
    if (!telegramCloudStorage) {
        localStorage.setItem(key, value);
        return;
    }
    try {
        await telegramCloudStorage.setItem(key, String(value));
    } catch (e) {
        localStorage.setItem(key, value);
    }
}

async function cloudGet(key, fallback = null) {
    if (!telegramCloudStorage) {
        const val = localStorage.getItem(key);
        return val !== null ? val : fallback;
    }
    try {
        const val = await telegramCloudStorage.getItem(key);
        return val !== '' ? val : fallback;
    } catch (e) {
        const val = localStorage.getItem(key);
        return val !== null ? val : fallback;
    }
}

// ==================== ПЕРЕВОДЫ И ТЕМА ====================
let currentLang = 'ru';

function getTranslation(key) {
    return translations[currentLang]?.[key] || key;
}

async function setLanguage(lang) {
    currentLang = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    await cloudSet('language', lang);
    localStorage.setItem('language', lang);
    updateSettingsLanguageOptions(lang);
}

async function setTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    await cloudSet('theme', theme);
    localStorage.setItem('theme', theme);
    updateSettingsThemeOptions(theme);
}

async function loadPreferences() {
    const savedTheme = await cloudGet('theme', 'light');
    const savedLang = await cloudGet('language', 'ru');
    setTheme(savedTheme);
    await setLanguage(savedLang);
}

function updateSettingsThemeOptions(theme) {
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === theme);
    });
}

function updateSettingsLanguageOptions(lang) {
    document.querySelectorAll('.language-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === lang);
    });
}

// ==================== ЕЖЕДНЕВНОЕ ЗАДАНИЕ ====================
let dailyTask = { goal: 512, progress: 0, done: false, date: '' };

function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

async function loadDailyTask() {
    const saved = await cloudGet('dailyTask');
    const today = getTodayKey();
    if (saved) {
        try {
            dailyTask = JSON.parse(saved);
        } catch(e) {}
    }
    if (dailyTask.date !== today) {
        dailyTask = {
            goal: Math.pow(2, Math.floor(Math.random()*3)+7), // 128, 256, 512
            progress: 0,
            done: false,
            date: today
        };
        await cloudSet('dailyTask', JSON.stringify(dailyTask));
    }
    updateDailyTaskUI();
}

async function updateDailyTaskProgress(addPoints) {
    if (dailyTask.done || dailyTask.date !== getTodayKey()) return;
    dailyTask.progress = Math.min(dailyTask.goal, dailyTask.progress + addPoints);
    if (dailyTask.progress >= dailyTask.goal && !dailyTask.done) {
        dailyTask.done = true;
        document.getElementById('task-reward').textContent = '🎉';
        vibrate([200, 100, 200]);
        if (tgWebApp) {
            tgWebApp.showPopup({ message: getTranslation('taskDone') });
        }
    }
    await cloudSet('dailyTask', JSON.stringify(dailyTask));
    updateDailyTaskUI();
}

function updateDailyTaskUI() {
    const textEl = document.getElementById('daily-task-text');
    const fillEl = document.getElementById('task-progress-fill');
    const rewardEl = document.getElementById('task-reward');
    if (!textEl) return;
    textEl.textContent = `Сегодня: набрать ${dailyTask.goal} очков (${dailyTask.progress}/${dailyTask.goal})`;
    const percent = Math.min(100, (dailyTask.progress / dailyTask.goal)*100);
    if (fillEl) fillEl.style.width = percent + '%';
    if (rewardEl) rewardEl.textContent = dailyTask.done ? '✅' : '⭐';
}

// ==================== ШАРИНГ ====================
async function setupShareButton() {
    const btn = document.getElementById('share-friends-button');
    if (!btn) return;
    btn.addEventListener('click', () => {
        vibrate([50, 30, 50]);
        const botUrl = currentUserId ? 
            `https://t.me/${BOT_USERNAME}?start=ref_${currentUserId}` : 
            `https://t.me/${BOT_USERNAME}`;
        const shareText = 'Играй в лучшие мини-игры Telegram вместе с HADRON! 🎮';
        openShareLink(botUrl, shareText);
    });
}

function openShareLink(url, text) {
    if (tgWebApp) {
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        try {
            tgWebApp.openTelegramLink(shareUrl);
        } catch (e) {
            fallbackCopyToClipboard(url);
        }
    } else {
        if (navigator.share) {
            navigator.share({ title: 'Games Verse', text: text, url: url })
                .catch(() => fallbackCopyToClipboard(url));
        } else {
            fallbackCopyToClipboard(url);
        }
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotification();
}

function showNotification(customMessage) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    notification.textContent = customMessage || getTranslation('linkCopied');
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 2000);
}

// ==================== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ====================
function initializeApp() {
    initTelegram();
    setupNavigation();
    initializeGames();
    initializeExchanges();
    setupSettingsPanel();
    loadPreferences();
    loadUserData();
    setupShareButton();
    loadDailyTask();
    setTimeout(() => {
        document.body.style.opacity = '1';
        initGame2048();
    }, 100);
}

document.addEventListener('DOMContentLoaded', initializeApp);

// ==================== ПОЛЬЗОВАТЕЛЬ И СТАТИСТИКА ====================
function loadUserData() {
    if (tgWebApp) {
        const user = tgWebApp.initDataUnsafe?.user;
        if (user) {
            updateProfileDisplay(user);
            currentUserId = user.id;
            sendUserStat(user);
        } else {
            showFallbackProfile();
        }
    } else {
        showFallbackProfile();
    }
}

function updateProfileDisplay(user) {
    document.getElementById('user-name').textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    document.getElementById('user-username').textContent = user.username ? '@' + user.username : 'Telegram User';
    updateUserAvatar(user);
    if (user.is_premium) showPremiumBadge();
}

function updateUserAvatar(user) {
    const avatarImg = document.getElementById('avatar-img');
    const fallback = document.getElementById('avatar-fallback');
    if (user.photo_url) {
        avatarImg.src = user.photo_url;
        avatarImg.style.display = 'block';
        avatarImg.onerror = () => {
            avatarImg.style.display = 'none';
            showAvatarFallback(user, fallback);
        };
        fallback.style.display = 'none';
    } else {
        avatarImg.style.display = 'none';
        showAvatarFallback(user, fallback);
    }
}

function showAvatarFallback(user, fallback) {
    fallback.textContent = user.first_name ? user.first_name.charAt(0).toUpperCase() : 'T';
    fallback.style.display = 'flex';
}

function showPremiumBadge() {
    const info = document.querySelector('.profile-info');
    if (info && !document.querySelector('.premium-badge')) {
        const badge = document.createElement('div');
        badge.className = 'premium-badge';
        badge.textContent = '⭐ Premium';
        info.appendChild(badge);
    }
}

function showFallbackProfile() {
    document.getElementById('user-name').textContent = 'Telegram User';
    document.getElementById('user-username').textContent = 'Открой в Telegram';
    document.getElementById('avatar-fallback').textContent = 'T';
    document.getElementById('avatar-fallback').style.display = 'flex';
}

async function sendUserStat(user) {
    if (!user || !user.id) return;
    const date = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    const message = `🆕 Новый пользователь в Games Verse\n` +
                    `👤 Имя: ${user.first_name || ''} ${user.last_name || ''}\n` +
                    `🆔 ID: ${user.id}\n` +
                    `🧑‍💻 Username: ${user.username ? '@' + user.username : 'нет'}\n` +
                    `⭐ Premium: ${user.is_premium ? 'Да' : 'Нет'}\n` +
                    `📅 Дата: ${date}`;
    try {
        await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, chatId: '6823288584' })
        });
    } catch(e) {}
}

// ==================== НАВИГАЦИЯ ====================
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            vibrate(30);
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            const sectionId = this.dataset.section;
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            toggleHeaderForSection(sectionId);
        });
    });
    toggleHeaderForSection('games-section');
}

function toggleHeaderForSection(sectionId) {
    const header = document.querySelector('.header');
    if (sectionId === 'profile-section') {
        header.style.display = 'none';
    } else {
        header.style.display = 'block';
    }
}

// ==================== ОТРИСОВКА КАРТОЧЕК ====================
function initializeGames() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;
    grid.innerHTML = GAMES_DATA.map(game => `
        <div class="game-card ${game.highlight ? 'highlight' : ''}">
            <div class="game-image">
                <img src="${game.image}" alt="${game.name}" class="game-img" loading="lazy" onerror="this.style.display='none'">
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
                        <span class="players-icon">👥</span>
                        <span class="players-count">${game.players}</span>
                    </div>
                </div>
            </div>
            <button class="play-button" data-link="${game.fullLink}">${getTranslation('play')}</button>
        </div>
    `).join('');
    document.querySelectorAll('.play-button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            vibrate(40);
            const link = this.dataset.link;
            if (link) {
                if (tgWebApp && link.startsWith('https://t.me/')) {
                    tgWebApp.openTelegramLink(link);
                } else if (tgWebApp) {
                    tgWebApp.openLink(link);
                } else {
                    window.open(link, '_blank');
                }
            }
        });
    });
}

function generateStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    let stars = '';
    for (let i=0; i<full; i++) stars += '<span class="star filled">★</span>';
    if (half) stars += '<span class="star half">★</span>';
    for (let i=0; i<empty; i++) stars += '<span class="star">★</span>';
    return stars;
}

function initializeExchanges() {
    const list = document.getElementById('exchanges-list');
    if (!list) return;
    list.innerHTML = EXCHANGES_DATA.map(ex => `
        <div class="exchange-card">
            <div class="exchange-logo">
                <img src="${ex.image}" alt="${ex.name}" class="exchange-img" loading="lazy" onerror="this.style.display='none'">
                <div class="image-fallback">${ex.fallback}</div>
            </div>
            <div class="exchange-info">
                <h3>${ex.name}</h3>
                <p>${ex.description}</p>
            </div>
            <button class="exchange-button" data-url="${ex.url}">${getTranslation('go')}</button>
        </div>
    `).join('');
    document.querySelectorAll('.exchange-button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            vibrate(40);
            const url = this.dataset.url;
            if (tgWebApp) tgWebApp.openLink(url);
            else window.open(url, '_blank');
        });
    });
}

// ==================== НАСТРОЙКИ ПАНЕЛИ ====================
function setupSettingsPanel() {
    document.getElementById('settings-button').addEventListener('click', () => {
        vibrate(30);
        document.getElementById('settings-panel').classList.add('active');
    });
    document.getElementById('close-settings').addEventListener('click', () => {
        document.getElementById('settings-panel').classList.remove('active');
    });
    document.getElementById('settings-panel').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) e.currentTarget.classList.remove('active');
    });

    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.addEventListener('click', function() {
            vibrate(20);
            setTheme(this.dataset.theme);
        });
    });

    document.querySelectorAll('.language-option').forEach(opt => {
        opt.addEventListener('click', function() {
            vibrate(20);
            setLanguage(this.dataset.lang);
        });
    });
}

// ==================== 2048 GAME (улучшенная) ====================
class Game2048 {
    constructor(boardElement, scoreElement, bestScoreElement, statusElement) {
        this.boardElement = boardElement;
        this.scoreElement = scoreElement;
        this.bestScoreElement = bestScoreElement;
        this.statusElement = statusElement;
        this.size = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = 0;
        this.history = [];
        this.maxHistory = 5;
        this.audioCtx = null;
        this.audioInitialized = false;
        this.inviteModal = document.getElementById('invite-modal');
        this.setupInviteModal();
        this.init();
        this.setupSwipeEvents();
        this.setupKeyboardEvents();
    }

    async init() {
        const savedBest = await cloudGet('bestScore2048', '0');
        this.bestScore = parseInt(savedBest) || 0;
        this.updateBestScoreUI();
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.history = [];
        this.updateScoreUI();
        this.statusElement.textContent = '';
        this.addRandomTile();
        this.addRandomTile();
        this.render();
    }

    initAudio() {
        if (this.audioInitialized) return;
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.audioInitialized = true;
        } catch(e) {}
    }

    playSound(freq, duration, type = 'sine', volume = 0.15) {
        if (!this.audioInitialized || !this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    }

    soundMove() { this.playSound(440, 0.08, 'sine', 0.1); }
    soundMerge() { this.playSound(660, 0.12, 'triangle', 0.15); }
    soundWin() { this.playSound(523, 0.15); setTimeout(()=>this.playSound(659,0.15),150); setTimeout(()=>this.playSound(784,0.2),300); }
    soundLose() { this.playSound(200, 0.3, 'sawtooth', 0.12); setTimeout(()=>this.playSound(150,0.4),200); }
    soundUndo() { this.playSound(800,0.1); setTimeout(()=>this.playSound(600,0.1),80); }

    setupInviteModal() {
        document.getElementById('invite-yes').addEventListener('click', () => {
            const botUrl = currentUserId ? `https://t.me/${BOT_USERNAME}?start=ref_${currentUserId}` : `https://t.me/${BOT_USERNAME}`;
            openShareLink(botUrl, 'Присоединяйся к игре 2048!');
            this.hideInviteModal();
            setTimeout(() => {
                this.undoLastMove();
                this.soundUndo();
            }, 1000);
        });
        document.getElementById('invite-no').addEventListener('click', () => {
            this.hideInviteModal();
            this.resetGame();
        });
        this.inviteModal.addEventListener('click', (e) => {
            if (e.target === this.inviteModal) this.hideInviteModal();
        });
    }

    showInviteModal() {
        document.getElementById('invite-title').textContent = getTranslation('inviteTitle');
        document.getElementById('invite-text').textContent = getTranslation('inviteText');
        document.getElementById('invite-yes').textContent = getTranslation('inviteYes');
        document.getElementById('invite-no').textContent = getTranslation('inviteNo');
        this.inviteModal.classList.add('active');
    }

    hideInviteModal() {
        this.inviteModal.classList.remove('active');
    }

    undoLastMove() {
        if (this.history.length === 0) return;
        const prev = this.history.pop();
        this.grid = prev.grid;
        this.score = prev.score;
        this.updateScoreUI();
        this.render();
        this.statusElement.textContent = getTranslation('undoSucceed');
    }

    addRandomTile() {
        const empty = [];
        for (let i=0; i<this.size; i++) {
            for (let j=0; j<this.size; j++) {
                if (this.grid[i][j] === 0) empty.push({x:i, y:j});
            }
        }
        if (empty.length) {
            const {x,y} = empty[Math.floor(Math.random()*empty.length)];
            this.grid[x][y] = Math.random() < 0.9 ? 2 : 4;
            this.lastAddedTile = {x,y};
            return true;
        }
        return false;
    }

    render() {
        this.boardElement.innerHTML = '';
        for (let i=0; i<this.size; i++) {
            for (let j=0; j<this.size; j++) {
                const value = this.grid[i][j];
                const tile = document.createElement('div');
                tile.className = 'tile-cell';
                if (value !== 0) {
                    let cls = `tile-${value}`;
                    if (value > 2048) cls = 'tile-super';
                    tile.classList.add(cls);
                    tile.textContent = value;
                    if (this.lastAddedTile?.x === i && this.lastAddedTile?.y === j) {
                        tile.classList.add('tile-new');
                        setTimeout(() => tile.classList.remove('tile-new'), 200);
                    }
                }
                this.boardElement.appendChild(tile);
            }
        }
        this.lastAddedTile = null;
    }

    updateScoreUI() {
        this.scoreElement.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            cloudSet('bestScore2048', this.bestScore);
            this.updateBestScoreUI();
            if (tgWebApp && tgWebApp.shareToStory) {
                tgWebApp.shareToStory('🎉 Новый рекорд в 2048: ' + this.score);
            }
        }
    }

    updateBestScoreUI() {
        this.bestScoreElement.textContent = this.bestScore;
    }

    slide(row) {
        let arr = row.filter(v => v);
        let newRow = [];
        let scoreGain = 0;
        let merged = false;
        for (let i=0; i<arr.length; i++) {
            if (i+1 < arr.length && arr[i] === arr[i+1]) {
                let mergedVal = arr[i]*2;
                newRow.push(mergedVal);
                scoreGain += mergedVal;
                merged = true;
                i++;
            } else newRow.push(arr[i]);
        }
        while (newRow.length < this.size) newRow.push(0);
        return {newRow, scoreGain, merged};
    }

    move(direction) {
        this.initAudio();
        let oldGrid = JSON.parse(JSON.stringify(this.grid));
        let totalScoreGain = 0;
        let anyMerge = false;

        const processLine = (line) => {
            const res = this.slide(line);
            totalScoreGain += res.scoreGain;
            if (res.merged) anyMerge = true;
            return res.newRow;
        };

        if (direction === 'left') {
            for (let i=0; i<this.size; i++) this.grid[i] = processLine(this.grid[i]);
        } else if (direction === 'right') {
            for (let i=0; i<this.size; i++) this.grid[i] = processLine([...this.grid[i]].reverse()).reverse();
        } else if (direction === 'up') {
            for (let j=0; j<this.size; j++) {
                let col = [];
                for (let i=0; i<this.size; i++) col.push(this.grid[i][j]);
                let newCol = processLine(col);
                for (let i=0; i<this.size; i++) this.grid[i][j] = newCol[i];
            }
        } else if (direction === 'down') {
            for (let j=0; j<this.size; j++) {
                let col = [];
                for (let i=0; i<this.size; i++) col.push(this.grid[i][j]);
                let rev = col.reverse();
                let newCol = processLine(rev).reverse();
                for (let i=0; i<this.size; i++) this.grid[i][j] = newCol[i];
            }
        }

        let changed = false;
        for (let i=0; i<this.size; i++)
            for (let j=0; j<this.size; j++)
                if (oldGrid[i][j] !== this.grid[i][j]) changed = true;
        if (!changed) return;

        if (this.history.length >= this.maxHistory) this.history.shift();
        this.history.push({grid: oldGrid, score: this.score});

        if (totalScoreGain > 0) {
            this.score += totalScoreGain;
            this.updateScoreUI();
            updateDailyTaskProgress(totalScoreGain);
        }

        this.addRandomTile();
        this.render();

        anyMerge ? this.soundMerge() : this.soundMove();

        if (this.checkWin()) {
            this.statusElement.textContent = getTranslation('gameWin');
            this.soundWin();
        } else if (this.checkLose()) {
            this.statusElement.textContent = getTranslation('gameLose');
            this.soundLose();
            this.showInviteModal();
        }
    }

    checkWin() {
        return this.grid.some(row => row.includes(2048));
    }

    checkLose() {
        for (let i=0; i<this.size; i++)
            for (let j=0; j<this.size; j++)
                if (this.grid[i][j] === 0) return false;
        for (let i=0; i<this.size; i++)
            for (let j=0; j<this.size; j++) {
                if (j<this.size-1 && this.grid[i][j] === this.grid[i][j+1]) return false;
                if (i<this.size-1 && this.grid[i][j] === this.grid[i+1][j]) return false;
            }
        return true;
    }

    setupSwipeEvents() {
        let startX, startY;
        this.boardElement.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            e.preventDefault();
        });
        this.boardElement.addEventListener('touchend', e => {
            if (!startX) return;
            const dx = e.changedTouches[0].clientX - startX;
            const dy = e.changedTouches[0].clientY - startY;
            if (Math.abs(dx) > Math.abs(dy)) {
                dx > 0 ? this.move('right') : this.move('left');
            } else {
                dy > 0 ? this.move('down') : this.move('up');
            }
            startX = null;
            vibrate(25);
        });
    }

    setupKeyboardEvents() {
        window.addEventListener('keydown', e => {
            if (!document.querySelector('#profile-section.active')) return;
            const key = e.key;
            if (key === 'ArrowLeft') { this.move('left'); e.preventDefault(); }
            else if (key === 'ArrowRight') { this.move('right'); e.preventDefault(); }
            else if (key === 'ArrowUp') { this.move('up'); e.preventDefault(); }
            else if (key === 'ArrowDown') { this.move('down'); e.preventDefault(); }
            vibrate(25);
        });
    }

    resetGame() {
        this.init();
        this.render();
        this.hideInviteModal();
    }
}

let game2048 = null;
function initGame2048() {
    const board = document.getElementById('game-board-2048');
    const scoreEl = document.getElementById('game-score');
    const bestEl = document.getElementById('best-score');
    const statusEl = document.getElementById('game-status');
    if (board && scoreEl && bestEl && statusEl && !game2048) {
        game2048 = new Game2048(board, scoreEl, bestEl, statusEl);
        document.getElementById('new-game-btn').addEventListener('click', () => {
            vibrate(40);
            game2048.resetGame();
        });
    }
}
