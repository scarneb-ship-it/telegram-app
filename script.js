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
        gameLose: "Игра окончена! 😔"
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
        gameLose: "Game over! 😔"
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
    initAIPowerTapGame();
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

// ==================== НАВИГАЦИЯ С СКРЫТИЕМ HEADER ====================
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
            if (window.Telegram && window.Telegram.WebApp) {
                const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(botUrl)}&text=${encodeURIComponent(shareText)}`;
                try {
                    window.Telegram.WebApp.openTelegramLink(shareUrl);
                } catch (error) {
                    fallbackCopyToClipboard(botUrl);
                }
            } else {
                if (navigator.share) {
                    navigator.share({
                        title: 'Games Verse',
                        text: shareText,
                        url: botUrl,
                    }).catch(() => fallbackCopyToClipboard(botUrl));
                } else {
                    fallbackCopyToClipboard(botUrl);
                }
            }
        });
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

// ==================== AI POWER TAP GAME ====================
class AIPowerTapGame {
    constructor() {
        this.power = 0;
        this.powerPerClick = 1;
        this.powerPerSecond = 0;
        this.prestigeMultiplier = 1;
        this.upgrades = [
            {
                id: 'cpu',
                name: '💻 Процессор',
                baseCost: 15,
                cost: 15,
                level: 0,
                effect: () => { this.powerPerClick += 1; },
                description: 'Увеличивает силу тапа на 1'
            },
            {
                id: 'gpu',
                name: '🎮 Видеокарта',
                baseCost: 100,
                cost: 100,
                level: 0,
                effect: () => { this.powerPerSecond += 1; },
                description: 'Авто-генерация +1 AI/сек'
            },
            {
                id: 'neural',
                name: '🧠 Нейросеть',
                baseCost: 500,
                cost: 500,
                level: 0,
                effect: () => { this.powerPerSecond += 5; },
                description: 'Авто-генерация +5 AI/сек'
            },
            {
                id: 'quantum',
                name: '⚛️ Квантовый чип',
                baseCost: 2000,
                cost: 2000,
                level: 0,
                effect: () => { this.powerPerClick += 3; this.powerPerSecond += 2; },
                description: 'Сила тапа +3, авто +2/сек'
            }
        ];
        this.loadGame();
        this.render();
        this.startAutoGenerate();
    }

    loadGame() {
        const saved = localStorage.getItem('ai_power_tap_save');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.power = data.power || 0;
                this.powerPerClick = data.powerPerClick || 1;
                this.powerPerSecond = data.powerPerSecond || 0;
                this.prestigeMultiplier = data.prestigeMultiplier || 1;
                if (data.upgrades) {
                    this.upgrades.forEach((u, i) => {
                        if (data.upgrades[i]) {
                            u.level = data.upgrades[i].level || 0;
                            u.cost = data.upgrades[i].cost || u.baseCost;
                        }
                    });
                }
            } catch (e) {
                console.error('Ошибка загрузки сохранения AI Power Tap');
            }
        }
    }

    saveGame() {
        const data = {
            power: this.power,
            powerPerClick: this.powerPerClick,
            powerPerSecond: this.powerPerSecond,
            prestigeMultiplier: this.prestigeMultiplier,
            upgrades: this.upgrades.map(u => ({ level: u.level, cost: u.cost }))
        };
        localStorage.setItem('ai_power_tap_save', JSON.stringify(data));
    }

    addPower(amount) {
        this.power += amount;
        this.updateUI();
        this.saveGame();
    }

    buyUpgrade(upgrade) {
        if (this.power >= upgrade.cost) {
            this.power -= upgrade.cost;
            upgrade.level++;
            upgrade.effect();
            upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level));
            this.updateUI();
            this.saveGame();
            this.spawnParticles('✨');
        }
    }

    canPrestige() {
        return this.power >= 10000;
    }

    prestige() {
        if (this.canPrestige()) {
            this.prestigeMultiplier *= 2;
            this.power = 0;
            this.powerPerClick = this.prestigeMultiplier;
            this.powerPerSecond = 0;
            this.upgrades.forEach(u => {
                u.level = 0;
                u.cost = u.baseCost;
            });
            this.updateUI();
            this.saveGame();
            alert('Престиж! Ваш множитель теперь x' + this.prestigeMultiplier);
        }
    }

    startAutoGenerate() {
        setInterval(() => {
            if (this.powerPerSecond > 0) {
                this.addPower(this.powerPerSecond);
            }
        }, 1000);
    }

    handleTap() {
        this.addPower(this.powerPerClick);
        this.spawnParticles('⚡');
        vibrate();
    }

    spawnParticles(emoji) {
        const container = document.getElementById('tap-particles');
        if (!container) return;
        for (let i = 0; i < 4; i++) {
            const particle = document.createElement('span');
            particle.className = 'particle';
            particle.textContent = emoji;
            particle.style.left = Math.random() * 80 + 10 + '%';
            particle.style.top = Math.random() * 60 + 20 + '%';
            particle.style.animationDelay = Math.random() * 0.2 + 's';
            container.appendChild(particle);
            setTimeout(() => particle.remove(), 600);
        }
    }

    updateUI() {
        // Обновление счётчика
        const powerDisplay = document.getElementById('power-display');
        if (powerDisplay) {
            powerDisplay.textContent = Math.floor(this.power).toLocaleString();
        }
        // Обновление CPS
        const cpsDisplay = document.getElementById('cps-display');
        if (cpsDisplay) {
            cpsDisplay.textContent = this.powerPerSecond + ' AI/сек';
        }
        // Обновление кнопок улучшений
        this.renderUpgrades();
        // Кнопка престижа
        const prestigeBtn = document.getElementById('prestige-button');
        if (prestigeBtn) {
            prestigeBtn.disabled = !this.canPrestige();
        }
    }

    render() {
        this.updateUI();
        this.renderUpgrades();
        // Обработчик тапа
        const tapCircle = document.getElementById('tap-circle');
        if (tapCircle) {
            tapCircle.addEventListener('click', () => this.handleTap());
        }
        // Кнопка престижа
        const prestigeBtn = document.getElementById('prestige-button');
        if (prestigeBtn) {
            prestigeBtn.addEventListener('click', () => this.prestige());
        }
    }

    renderUpgrades() {
        const list = document.getElementById('upgrades-list');
        if (!list) return;
        list.innerHTML = this.upgrades.map(upgrade => `
            <div class="upgrade-item">
                <div class="upgrade-info">
                    <div class="upgrade-name">${upgrade.name} (ур. ${upgrade.level})</div>
                    <div class="upgrade-effect">${upgrade.description}</div>
                </div>
                <button class="upgrade-buy" data-upgrade-id="${upgrade.id}" ${this.power < upgrade.cost ? 'disabled' : ''}>
                    ${upgrade.cost.toLocaleString()} AI
                </button>
            </div>
        `).join('');
        // Навешиваем обработчики
        list.querySelectorAll('.upgrade-buy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-upgrade-id');
                const upgrade = this.upgrades.find(u => u.id === id);
                if (upgrade) this.buyUpgrade(upgrade);
            });
        });
    }
}

let aiPowerTapGame = null;
function initAIPowerTapGame() {
    if (!aiPowerTapGame) {
        aiPowerTapGame = new AIPowerTapGame();
    }
}

// Старая игра 2048 удалена полностью
