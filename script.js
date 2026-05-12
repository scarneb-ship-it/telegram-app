// ==================== КОНФИГУРАЦИЯ ====================
const BOT_USERNAME = 'khadron_bot';
let currentUserId = null;

// Адрес вашего Cloudflare Worker (замените на свой, если отличается)
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
        undoSound: "Звук отмены"
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
        undoSound: "Undo sound"
    }
};

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function vibrate() {
    if (navigator.vibrate) navigator.vibrate(50);
}

function initializeApp() {
    initializeTelegramWebApp();
    setupNavigation();
    initializeGames();
    initializeExchanges();
    setupSettingsPanel();
    loadThemePreference();
    loadLanguagePreference();
    loadUserData();
    setupShareButton();
    setTimeout(() => document.body.style.opacity = '1', 100);
}

function initializeTelegramWebApp() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        const themeParams = tg.themeParams;
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

function initializeGames() {
    const gamesGrid = document.getElementById('games-grid');
    if (!gamesGrid) return;
    gamesGrid.innerHTML = GAMES_DATA.map(game => `
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
                        <span class="players-icon">👥</span>
                        <span class="players-count">${game.players}</span>
                    </div>
                </div>
            </div>
            <button class="play-button" data-link="${game.fullLink || (game.bot ? 'https://t.me/' + game.bot + '?start=app' : '')}">
                ${getTranslation('play')}
            </button>
        </div>
    `).join('');
    setupGameButtons();
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<span class="star filled">★</span>';
    if (hasHalfStar) stars += '<span class="star half">★</span>';
    for (let i = 0; i < emptyStars; i++) stars += '<span class="star">★</span>';
    return stars;
}

function initializeExchanges() {
    const exchangesList = document.getElementById('exchanges-list');
    if (!exchangesList) return;
    exchangesList.innerHTML = EXCHANGES_DATA.map(exchange => `
        <div class="exchange-card" data-exchange-id="${exchange.id}">
            <div class="exchange-logo">
                <img src="${exchange.image}" alt="${exchange.name}" class="exchange-img" onerror="this.style.display='none'">
                <div class="image-fallback">${exchange.fallback}</div>
            </div>
            <div class="exchange-info">
                <h3>${exchange.name}</h3>
                <p>${exchange.description}</p>
            </div>
            <button class="exchange-button" data-url="${exchange.url}">
                ${getTranslation('go')}
            </button>
        </div>
    `).join('');
    setupExchangeButtons();
}

function loadUserData() {
    if (window.Telegram && window.Telegram.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe?.user;
        if (user) {
            updateProfileDisplay(user);
            currentUserId = user.id;
            console.log('🔍 Telegram User Data:', user);
            console.log('✅ Реферальный ID установлен:', currentUserId);
            sendUserStat(user);
        } else {
            showFallbackProfile();
            currentUserId = null;
        }
    } else {
        showFallbackProfile();
        currentUserId = null;
    }
}

function updateProfileDisplay(user) {
    const userName = document.getElementById('user-name');
    if (userName) userName.textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    const userUsername = document.getElementById('user-username');
    if (userUsername) userUsername.textContent = user.username ? '@' + user.username : 'Telegram User';
    updateUserAvatar(user);
    if (user.is_premium) showPremiumBadge();
}

function updateUserAvatar(user) {
    const avatarImg = document.getElementById('avatar-img');
    const avatarFallback = document.getElementById('avatar-fallback');
    if (!avatarImg) return;
    if (user.photo_url) {
        avatarImg.src = user.photo_url;
        avatarImg.style.display = 'block';
        avatarImg.onerror = () => { avatarImg.style.display = 'none'; showAvatarFallback(user, avatarFallback); };
        avatarFallback.style.display = 'none';
    } else {
        avatarImg.style.display = 'none';
        showAvatarFallback(user, avatarFallback);
    }
}

function showAvatarFallback(user, avatarFallback) {
    if (user.first_name) avatarFallback.textContent = user.first_name.charAt(0).toUpperCase();
    else avatarFallback.textContent = 'T';
    avatarFallback.style.display = 'flex';
}

function showPremiumBadge() {
    const profileInfo = document.querySelector('.profile-info');
    if (profileInfo && !document.querySelector('.premium-badge')) {
        const premiumBadge = document.createElement('div');
        premiumBadge.className = 'premium-badge';
        premiumBadge.innerHTML = '⭐ Premium';
        profileInfo.appendChild(premiumBadge);
    }
}

function showFallbackProfile() {
    const userName = document.getElementById('user-name');
    const userUsername = document.getElementById('user-username');
    const avatarFallback = document.getElementById('avatar-fallback');
    if (userName) userName.textContent = 'Telegram User';
    if (userUsername) userUsername.textContent = 'Открой в Telegram';
    if (avatarFallback) { avatarFallback.textContent = 'T'; avatarFallback.style.display = 'flex'; }
}

// ==================== СТАТИСТИКА ЧЕРЕЗ WORKER ====================
async function sendUserStat(user) {
    if (!user || !user.id) return;
    const date = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    const message = `🆕 *Новый пользователь в Games Verse*\n\n` +
                    `👤 *Имя:* ${user.first_name || ''} ${user.last_name || ''}\n` +
                    `🆔 *ID:* ${user.id}\n` +
                    `🧑‍💻 *Username:* ${user.username ? '@' + user.username : 'нет'}\n` +
                    `⭐ *Premium:* ${user.is_premium ? 'Да' : 'Нет'}\n` +
                    `📅 *Дата/время:* ${date}`;
    try {
        await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: message,
                chatId: '6823288584'
            })
        });
        console.log('✅ Статистика отправлена');
    } catch (err) {
        console.error('❌ Ошибка отправки статистики:', err);
    }
}

// ==================== НАВИГАЦИЯ ====================
const headerElement = document.querySelector('.header');
const mainContent = document.querySelector('.main-content');

function toggleHeaderForSection(sectionId) {
    if (!headerElement) return;
    if (sectionId === 'profile-section') {
        headerElement.style.display = 'none';
        if (mainContent) mainContent.style.paddingTop = '8px';
    } else {
        headerElement.style.display = 'block';
        if (mainContent) mainContent.style.paddingTop = '';
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            vibrate();
            const targetSection = this.getAttribute('data-section');
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) section.classList.add('active');
            });
            toggleHeaderForSection(targetSection);
        });
    });
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) toggleHeaderForSection(activeSection.id);
}

function setupGameButtons() {
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            vibrate();
            const link = this.getAttribute('data-link');
            if (link) {
                if (window.Telegram && window.Telegram.WebApp) {
                    if (link.startsWith('https://t.me/')) window.Telegram.WebApp.openTelegramLink(link);
                    else window.Telegram.WebApp.openLink(link);
                } else {
                    window.open(link, '_blank');
                }
            }
        });
    });
}

function setupExchangeButtons() {
    const exchangeButtons = document.querySelectorAll('.exchange-button');
    exchangeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            vibrate();
            const exchangeUrl = this.getAttribute('data-url');
            if (exchangeUrl) {
                if (window.Telegram && window.Telegram.WebApp) window.Telegram.WebApp.openLink(exchangeUrl);
                else window.open(exchangeUrl, '_blank');
            }
        });
    });
}

function setupSettingsPanel() {
    const settingsButton = document.getElementById('settings-button');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettings = document.getElementById('close-settings');
    if (settingsButton) settingsButton.addEventListener('click', () => { vibrate(); settingsPanel.classList.add('active'); });
    if (closeSettings) closeSettings.addEventListener('click', () => { vibrate(); settingsPanel.classList.remove('active'); });
    if (settingsPanel) settingsPanel.addEventListener('click', (e) => { if (e.target === settingsPanel) settingsPanel.classList.remove('active'); });
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            vibrate();
            const theme = this.getAttribute('data-theme');
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            if (theme === 'dark') document.body.classList.add('dark-theme');
            else document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', theme);
        });
    });
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            vibrate();
            const lang = this.getAttribute('data-lang');
            languageOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            setLanguage(lang);
            localStorage.setItem('language', lang);
        });
    });
}

function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) element.textContent = translations[lang][key];
    });
    // обновить модальное окно, если оно открыто
    const inviteModal = document.getElementById('invite-modal');
    if (inviteModal && inviteModal.classList.contains('active')) {
        document.getElementById('invite-title').textContent = translations[lang].inviteTitle;
        document.getElementById('invite-text').textContent = translations[lang].inviteText;
        document.getElementById('invite-yes').textContent = translations[lang].inviteYes;
        document.getElementById('invite-no').textContent = translations[lang].inviteNo;
    }
}

function getTranslation(key) {
    const currentLang = localStorage.getItem('language') || 'ru';
    return translations[currentLang]?.[key] || key;
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') document.body.classList.add('dark-theme');
    updateSettingsThemeOptions(savedTheme);
}

function loadLanguagePreference() {
    const savedLang = localStorage.getItem('language') || 'ru';
    setLanguage(savedLang);
    updateSettingsLanguageOptions(savedLang);
}

function updateSettingsThemeOptions(theme) {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-theme') === theme) option.classList.add('active');
    });
}

function updateSettingsLanguageOptions(lang) {
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) option.classList.add('active');
    });
}

// ==================== ШАРИНГ ====================
function setupShareButton() {
    const shareButton = document.getElementById('share-friends-button');
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            vibrate();
            let botUrl;
            if (currentUserId) {
                botUrl = `https://t.me/${BOT_USERNAME}?start=ref_${currentUserId}`;
            } else {
                botUrl = `https://t.me/${BOT_USERNAME}`;
            }
            const shareText = 'Играй в лучшие мини-игры Telegram вместе с HADRON! 🎮';
            openShareLink(botUrl, shareText);
        });
    }
}

function openShareLink(url, text) {
    if (window.Telegram && window.Telegram.WebApp) {
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        try {
            window.Telegram.WebApp.openTelegramLink(shareUrl);
        } catch (error) {
            fallbackCopyToClipboard(url);
        }
    } else {
        if (navigator.share) {
            navigator.share({
                title: 'Games Verse',
                text: text,
                url: url,
            }).catch(() => fallbackCopyToClipboard(url));
        } else {
            fallbackCopyToClipboard(url);
        }
    }
}

function fallbackCopyToClipboard(text) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification();
    } catch (err) {
        console.error('Copy failed:', err);
        showNotification('Не удалось скопировать ссылку');
    }
}

function showNotification(customMessage) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    if (customMessage) notification.textContent = customMessage;
    else {
        const currentLang = localStorage.getItem('language') || 'ru';
        notification.textContent = translations[currentLang].linkCopied;
    }
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 2000);
}

// ==================== 2048 GAME (IMPROVED) ====================
class Game2048 {
    constructor(boardElement, scoreElement, bestScoreElement, statusElement) {
        this.boardElement = boardElement;
        this.scoreElement = scoreElement;
        this.bestScoreElement = bestScoreElement;
        this.statusElement = statusElement;
        this.size = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = localStorage.getItem('bestScore2048') ? parseInt(localStorage.getItem('bestScore2048')) : 0;
        this.history = [];   // массив для хранения состояний {grid, score}
        this.maxHistory = 5; // храним последние 5 состояний
        this.updateBestScoreUI();
        this.init();
        this.setupSwipeEvents();
        this.setupKeyboardEvents();
        // Audio
        this.audioCtx = null;
        this.audioInitialized = false;

        // Обработчики модального окна
        this.inviteModal = document.getElementById('invite-modal');
        this.inviteYes = document.getElementById('invite-yes');
        this.inviteNo = document.getElementById('invite-no');
        this.setupInviteModal();
    }

    initAudio() {
        if (this.audioInitialized) return;
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.audioInitialized = true;
        } catch (e) {
            console.log('Web Audio API не поддерживается');
        }
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

    soundMove() {
        this.playSound(440, 0.08, 'sine', 0.1);
    }

    soundMerge() {
        this.playSound(660, 0.12, 'triangle', 0.15);
    }

    soundWin() {
        this.playSound(523, 0.15, 'sine', 0.2);
        setTimeout(() => this.playSound(659, 0.15, 'sine', 0.2), 150);
        setTimeout(() => this.playSound(784, 0.2, 'sine', 0.2), 300);
    }

    soundLose() {
        this.playSound(200, 0.3, 'sawtooth', 0.12);
        setTimeout(() => this.playSound(150, 0.4, 'sawtooth', 0.12), 200);
    }

    soundUndo() {
        this.playSound(800, 0.1, 'sine', 0.1);
        setTimeout(() => this.playSound(600, 0.1, 'sine', 0.1), 80);
    }

    setupInviteModal() {
        if (this.inviteYes) {
            this.inviteYes.addEventListener('click', () => {
                this.handleInviteYes();
            });
        }
        if (this.inviteNo) {
            this.inviteNo.addEventListener('click', () => {
                this.hideInviteModal();
                this.resetGame();
            });
        }
        // Клик на оверлей закрывает модалку
        if (this.inviteModal) {
            this.inviteModal.addEventListener('click', (e) => {
                if (e.target === this.inviteModal) {
                    this.hideInviteModal();
                }
            });
        }
    }

    showInviteModal() {
        if (!this.inviteModal) return;
        // Обновляем тексты в соответствии с языком
        const lang = localStorage.getItem('language') || 'ru';
        document.getElementById('invite-title').textContent = translations[lang].inviteTitle;
        document.getElementById('invite-text').textContent = translations[lang].inviteText;
        document.getElementById('invite-yes').textContent = translations[lang].inviteYes;
        document.getElementById('invite-no').textContent = translations[lang].inviteNo;
        this.inviteModal.classList.add('active');
    }

    hideInviteModal() {
        if (this.inviteModal) this.inviteModal.classList.remove('active');
    }

    handleInviteYes() {
        // Открываем шаринг с реферальной ссылкой
        const botUrl = currentUserId ? `https://t.me/${BOT_USERNAME}?start=ref_${currentUserId}` : `https://t.me/${BOT_USERNAME}`;
        const shareText = 'Присоединяйся к игре 2048 в Games Verse! 🎮';
        openShareLink(botUrl, shareText);
        // После открытия ссылки планируем отмену хода (пользователь вернётся)
        this.hideInviteModal();
        // Имитация: через 1 секунду отменяем ход и воспроизводим звук
        setTimeout(() => {
            this.undoLastMove();
            this.soundUndo();
        }, 1000);
    }

    undoLastMove() {
        if (this.history.length === 0) {
            this.statusElement.textContent = 'Нет ходов для отмены';
            return;
        }
        const prevState = this.history.pop();
        this.grid = prevState.grid;
        this.score = prevState.score;
        this.updateScoreUI();
        this.render();
        this.statusElement.textContent = getTranslation('undoSucceed');
        // Проверяем статус после отмены
        if (this.checkWin()) {
            this.statusElement.textContent = getTranslation('gameWin');
            this.soundWin();
        } else if (this.checkLose()) {
            // опять проигрыш? можно снова показать окно, но лучше дать шанс
            this.statusElement.textContent = getTranslation('gameLose');
            // Не показываем снова автоматически, чтобы избежать зацикливания
        } else {
            // статус уже установлен
        }
    }

    init() {
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.history = [];
        this.updateScoreUI();
        this.statusElement.textContent = '';
        this.addRandomTile();
        this.addRandomTile();
        this.render();
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) emptyCells.push({x: i, y: j});
            }
        }
        if (emptyCells.length > 0) {
            const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[x][y] = Math.random() < 0.9 ? 2 : 4;
            this.lastAddedTile = {x, y};
            return true;
        }
        return false;
    }

    render() {
        this.boardElement.innerHTML = '';
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const value = this.grid[i][j];
                const tile = document.createElement('div');
                tile.className = 'tile-cell';
                if (value !== 0) {
                    let tileClass = `tile-${value}`;
                    if (value > 2048) tileClass = 'tile-super';
                    tile.classList.add(tileClass);
                    tile.textContent = value;
                    if (this.lastAddedTile && this.lastAddedTile.x === i && this.lastAddedTile.y === j) {
                        tile.classList.add('tile-new');
                        setTimeout(() => tile.classList.remove('tile-new'), 200);
                    }
                } else {
                    tile.textContent = '';
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
            localStorage.setItem('bestScore2048', this.bestScore);
            this.updateBestScoreUI();
        }
    }

    updateBestScoreUI() {
        this.bestScoreElement.textContent = this.bestScore;
    }

    slide(row) {
        let arr = row.filter(v => v !== 0);
        let newRow = [];
        let scoreGain = 0;
        let merged = false;
        for (let i = 0; i < arr.length; i++) {
            if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
                let mergedVal = arr[i] * 2;
                newRow.push(mergedVal);
                scoreGain += mergedVal;
                merged = true;
                i++;
            } else {
                newRow.push(arr[i]);
            }
        }
        while (newRow.length < this.size) newRow.push(0);
        return {newRow, scoreGain, merged};
    }

    move(direction) {
        // Инициализируем аудио при первом движении
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
            for (let i = 0; i < this.size; i++) {
                this.grid[i] = processLine(this.grid[i]);
            }
        } else if (direction === 'right') {
            for (let i = 0; i < this.size; i++) {
                let reversed = [...this.grid[i]].reverse();
                let newRow = processLine(reversed);
                this.grid[i] = newRow.reverse();
            }
        } else if (direction === 'up') {
            for (let j = 0; j < this.size; j++) {
                let column = [];
                for (let i = 0; i < this.size; i++) column.push(this.grid[i][j]);
                let newCol = processLine(column);
                for (let i = 0; i < this.size; i++) this.grid[i][j] = newCol[i];
            }
        } else if (direction === 'down') {
            for (let j = 0; j < this.size; j++) {
                let column = [];
                for (let i = 0; i < this.size; i++) column.push(this.grid[i][j]);
                let reversed = column.reverse();
                let newColReversed = processLine(reversed);
                let newCol = newColReversed.reverse();
                for (let i = 0; i < this.size; i++) this.grid[i][j] = newCol[i];
            }
        }

        let changed = false;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (oldGrid[i][j] !== this.grid[i][j]) changed = true;
            }
        }

        if (!changed) return; // ход не изменил поле

        // Сохраняем состояние перед изменением (если что-то изменилось)
        if (this.history.length >= this.maxHistory) {
            this.history.shift();
        }
        this.history.push({grid: oldGrid, score: this.score});

        if (totalScoreGain > 0) {
            this.score += totalScoreGain;
            this.updateScoreUI();
        }

        this.addRandomTile();
        this.render();

        // Звуки
        if (anyMerge) {
            this.soundMerge();
        } else {
            this.soundMove();
        }

        if (this.checkWin()) {
            this.statusElement.textContent = getTranslation('gameWin');
            this.soundWin();
        } else if (this.checkLose()) {
            this.statusElement.textContent = getTranslation('gameLose');
            this.soundLose();
            // Показываем модальное окно для отмены хода
            this.showInviteModal();
        }
    }

    checkWin() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 2048) return true;
            }
        }
        return false;
    }

    checkLose() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) return false;
            }
        }
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let val = this.grid[i][j];
                if (j < this.size-1 && val === this.grid[i][j+1]) return false;
                if (i < this.size-1 && val === this.grid[i+1][j]) return false;
            }
        }
        return true;
    }

    setupSwipeEvents() {
        let touchStartX = 0, touchStartY = 0;
        this.boardElement.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            e.preventDefault();
        });
        this.boardElement.addEventListener('touchend', (e) => {
            if (touchStartX === 0 && touchStartY === 0) return;
            let deltaX = e.changedTouches[0].clientX - touchStartX;
            let deltaY = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) return;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) this.move('right');
                else this.move('left');
            } else {
                if (deltaY > 0) this.move('down');
                else this.move('up');
            }
            touchStartX = 0; touchStartY = 0;
            vibrate();
        });
    }

    setupKeyboardEvents() {
        window.addEventListener('keydown', (e) => {
            if (document.querySelector('#profile-section.active')) {
                const key = e.key;
                if (key === 'ArrowLeft') { this.move('left'); e.preventDefault(); vibrate(); }
                else if (key === 'ArrowRight') { this.move('right'); e.preventDefault(); vibrate(); }
                else if (key === 'ArrowUp') { this.move('up'); e.preventDefault(); vibrate(); }
                else if (key === 'ArrowDown') { this.move('down'); e.preventDefault(); vibrate(); }
            }
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
        const newGameBtn = document.getElementById('new-game-btn');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                vibrate();
                game2048.resetGame();
            });
        }
    }
}

// Обновление перевода для статуса игры
const originalSetLanguage = setLanguage;
setLanguage = function(lang) {
    originalSetLanguage(lang);
    if (game2048 && game2048.statusElement) {
        const currentText = game2048.statusElement.textContent;
        if (currentText.includes('Победили') || currentText.includes('Win') || currentText.includes('Окончена') || currentText.includes('Lose')) {
            if (game2048.checkWin()) game2048.statusElement.textContent = getTranslation('gameWin');
            else if (game2048.checkLose()) game2048.statusElement.textContent = getTranslation('gameLose');
        }
    }
};

setTimeout(() => {
    initGame2048();
}, 300);
