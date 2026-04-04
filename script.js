// ==================== КОНФИГУРАЦИЯ ====================
// Легко меняйте игры и биржи здесь!
// Для игр: можно указать bot (будет открыто t.me/bot?start=app) 
// или fullLink (прямая ссылка, например реферальная)
// Для бирж: используется url

// Имя бота для реферальной ссылки (без @)
const BOT_USERNAME = 'khadron_bot';

// Глобальная переменная для хранения ID текущего пользователя
let currentUserId = null;

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
        yourScore: "Твой счёт:"
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
        yourScore: "Your score:"
    }
};

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function initializeApp() {
    initializeTelegramWebApp();
    setupNavigation();
    initializeGames();
    initializeExchanges();
    setupSettingsPanel();
    loadThemePreference();
    loadLanguagePreference();
    loadUserData(); // Загружает данные пользователя и устанавливает currentUserId
    setupShareButton(); // Теперь использует currentUserId
    initTapMiner();    // <-- НОВАЯ ИГРА В ПРОФИЛЕ
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
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
            // Сохраняем ID текущего пользователя для реферальной ссылки
            currentUserId = user.id;
            console.log('🔍 Telegram User Data:', user);
            console.log('✅ Реферальный ID установлен:', currentUserId);
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
        });
    });
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

// ==================== НОВАЯ ИГРА TAP MINER ====================
function initTapMiner() {
    const coinElement = document.getElementById('coin-clicker');
    const scoreSpan = document.getElementById('miner-score');
    const totalClicksSpan = document.getElementById('total-clicks');
    const resetBtn = document.getElementById('reset-score');
    
    if (!coinElement) return;

    // Загрузка сохранённых данных
    let currentScore = parseInt(localStorage.getItem('tapMinerScore')) || 0;
    let totalClicks = parseInt(localStorage.getItem('tapMinerTotalClicks')) || 0;
    
    function updateUI() {
        if (scoreSpan) scoreSpan.innerText = currentScore;
        if (totalClicksSpan) totalClicksSpan.innerText = totalClicks;
        localStorage.setItem('tapMinerScore', currentScore);
        localStorage.setItem('tapMinerTotalClicks', totalClicks);
    }
    
    function createFloatingNumber(x, y, value = '+1') {
        const fly = document.createElement('div');
        fly.className = 'fly-number';
        fly.textContent = value;
        fly.style.left = x + 'px';
        fly.style.top = y + 'px';
        document.body.appendChild(fly);
        setTimeout(() => fly.remove(), 600);
    }
    
    function handleTap(e) {
        vibrate();
        // Увеличиваем счёт
        currentScore += 1;
        totalClicks += 1;
        updateUI();
        
        // Анимация всплывающей цифры
        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        createFloatingNumber(clientX, clientY);
        
        // Мини-эффект пульсации монеты
        coinElement.style.transform = 'scale(0.9)';
        setTimeout(() => { coinElement.style.transform = ''; }, 100);
    }
    
    coinElement.addEventListener('click', handleTap);
    coinElement.addEventListener('touchstart', handleTap, { passive: false });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Сбросить весь прогресс в игре?')) {
                currentScore = 0;
                totalClicks = 0;
                updateUI();
                vibrate();
                showNotification('Счёт сброшен!');
            }
        });
    }
    
    updateUI();
}

// ==================== ШАРИНГ С РЕФЕРАЛЬНОЙ ССЫЛКОЙ ====================

function setupShareButton() {
    const shareButton = document.getElementById('share-friends-button');
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            vibrate();
            
            // Формируем реферальную ссылку на бота
            let botUrl;
            if (currentUserId) {
                // Уникальная ссылка с ID пользователя
                botUrl = `https://t.me/${BOT_USERNAME}?start=ref_${currentUserId}`;
                console.log(`🔗 Создана реферальная ссылка для пользователя ${currentUserId}: ${botUrl}`);
            } else {
                // Fallback: просто ссылка на бота без реферального параметра
                botUrl = `https://t.me/${BOT_USERNAME}`;
                console.log(`⚠️ ID пользователя не найден, используется обычная ссылка: ${botUrl}`);
            }
            
            const shareText = 'Играй в лучшие мини-игры Telegram вместе с HADRON! 🎮';
            
            if (window.Telegram && window.Telegram.WebApp) {
                const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(botUrl)}&text=${encodeURIComponent(shareText)}`;
                try {
                    window.Telegram.WebApp.openTelegramLink(shareUrl);
                    console.log('✅ Открыто окно шаринга Telegram');
                } catch (error) {
                    console.error('Ошибка при открытии шаринга:', error);
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

// ==================== БЕСКОНЕЧНЫЙ РАННЕР (DODGE GAME) ====================
(function initDodgeGame() {
    // DOM элементы
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const scoreSpan = document.getElementById('game-score');
    const highScoreSpan = document.getElementById('game-highscore');
    const startBtn = document.getElementById('game-start-btn');
    const restartBtn = document.getElementById('game-restart-btn');

    // Размеры canvas (фиксированные для расчётов)
    canvas.width = 350;
    canvas.height = 400;
    let width = canvas.width;
    let height = canvas.height;

    // Параметры игры
    let gameRunning = false;
    let animationId = null;
    let player = { x: width/2, y: height - 40, radius: 12 };
    let obstacles = [];
    let score = 0;
    let highScore = localStorage.getItem('dodgeHighScore') ? parseInt(localStorage.getItem('dodgeHighScore')) : 0;
    let baseSpeed = 2.5;
    let currentSpeed = baseSpeed;
    let speedIncreasePerSecond = 0.4;
    let lastTimestamp = 0;
    let lastSpeedIncreaseTime = 0;
    let lastScoreUpdateTime = 0;
    let spawnCounter = 0;
    let minSpawnDelay = 25;  // кадров
    let maxSpawnDelay = 45;
    
    // Управление (мышь / тач)
    let controlActive = false;

    // Инициализация рекорда в UI
    if (highScoreSpan) highScoreSpan.innerText = highScore;

    // Получение цветов в зависимости от темы
    function getThemeColors() {
        const isDark = document.body.classList.contains('dark-theme');
        return {
            bg: isDark ? '#0f172a' : '#f8fafc',
            player: isDark ? '#60a5fa' : '#3b82f6',
            obstacle: '#ef4444',
            text: isDark ? '#f1f5f9' : '#1e293b',
            stroke: isDark ? '#334155' : '#cbd5e1'
        };
    }

    // Сброс состояния игры
    function resetGameState() {
        obstacles = [];
        score = 0;
        currentSpeed = baseSpeed;
        if (scoreSpan) scoreSpan.innerText = '0';
        player.x = width/2;
        // Пересчёт спавна
        spawnCounter = randomSpawnDelay();
        lastSpeedIncreaseTime = performance.now();
        lastScoreUpdateTime = performance.now();
    }

    function randomSpawnDelay() {
        return Math.floor(Math.random() * (maxSpawnDelay - minSpawnDelay + 1) + minSpawnDelay);
    }

    // Создание нового препятствия
    function spawnObstacle() {
        const radius = 8 + Math.random() * 4;
        obstacles.push({
            x: Math.random() * (width - 2 * radius) + radius,
            y: -radius,
            radius: radius
        });
    }

    // Обновление счёта и скорости по времени
    function updateGameLogic(now) {
        if (!gameRunning) return;
        
        // Увеличение скорости каждую секунду
        if (now - lastSpeedIncreaseTime >= 1000) {
            currentSpeed += speedIncreasePerSecond;
            lastSpeedIncreaseTime = now;
            // Увеличиваем частоту спавна (уменьшаем задержку)
            if (minSpawnDelay > 12) minSpawnDelay -= 1;
            if (maxSpawnDelay > 25) maxSpawnDelay -= 1;
        }
        
        // Увеличение счета каждую секунду
        if (now - lastScoreUpdateTime >= 1000) {
            score++;
            if (scoreSpan) scoreSpan.innerText = score;
            if (score > highScore) {
                highScore = score;
                if (highScoreSpan) highScoreSpan.innerText = highScore;
                localStorage.setItem('dodgeHighScore', highScore);
            }
            lastScoreUpdateTime = now;
        }
        
        // Движение препятствий и проверка столкновений
        for (let i = 0; i < obstacles.length; i++) {
            const obs = obstacles[i];
            obs.y += currentSpeed;
            
            // Столкновение с игроком
            const dx = player.x - obs.x;
            const dy = player.y - obs.y;
            const dist = Math.hypot(dx, dy);
            if (dist < player.radius + obs.radius) {
                gameOver();
                return;
            }
        }
        
        // Удаление вышедших за границы
        obstacles = obstacles.filter(obs => obs.y - obs.radius < height + 50);
        
        // Спавн новых препятствий
        if (spawnCounter <= 0) {
            spawnObstacle();
            spawnCounter = randomSpawnDelay();
        } else {
            spawnCounter--;
        }
    }

    // Отрисовка всего
    function draw() {
        if (!ctx) return;
        const colors = getThemeColors();
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
        
        // Рисуем препятствия
        for (const obs of obstacles) {
            ctx.beginPath();
            ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
            ctx.fillStyle = colors.obstacle;
            ctx.fill();
            ctx.shadowBlur = 4;
            ctx.shadowColor = "rgba(0,0,0,0.3)";
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        // Рисуем игрока
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.player;
        ctx.fill();
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(player.x - 3, player.y - 3, 3, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(player.x + 3, player.y - 3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.arc(player.x - 3, player.y - 3, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(player.x + 3, player.y - 3, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Если игра не запущена, рисуем overlay
        if (!gameRunning) {
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = "#fff";
            ctx.font = "bold 20px Inter";
            ctx.textAlign = "center";
            ctx.fillText("⚡ НАЖМИ СТАРТ", width/2, height/2);
        }
    }
    
    // Игровой цикл
    function gameLoop(now) {
        if (!gameRunning) return;
        updateGameLogic(now);
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function startGame() {
        if (gameRunning) return;
        resetGameState();
        gameRunning = true;
        lastSpeedIncreaseTime = performance.now();
        lastScoreUpdateTime = performance.now();
        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function stopGame() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        gameRunning = false;
        draw(); // показать экран "СТАРТ"
    }
    
    function gameOver() {
        if (!gameRunning) return;
        stopGame();
        // Мгновенная перерисовка с сообщением
        if (ctx) {
            const colors = getThemeColors();
            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = "#fff";
            ctx.font = "bold 20px Inter";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", width/2, height/2 - 20);
            ctx.font = "14px Inter";
            ctx.fillText("Нажми Старт", width/2, height/2 + 20);
        }
        // Вибрация, если доступна
        if (navigator.vibrate) navigator.vibrate(200);
    }
    
    function restartGame() {
        stopGame();
        resetGameState();
        startGame();
    }
    
    // Управление мышью / тачем
    function handleMove(clientX) {
        if (!gameRunning) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        let canvasX = (clientX - rect.left) * scaleX;
        canvasX = Math.min(Math.max(canvasX, player.radius), width - player.radius);
        player.x = canvasX;
    }
    
    function onMouseMove(e) {
        if (!controlActive && gameRunning) {
            controlActive = true;
        }
        handleMove(e.clientX);
    }
    
    function onTouchMove(e) {
        e.preventDefault();
        if (!controlActive && gameRunning) controlActive = true;
        const touch = e.touches[0];
        handleMove(touch.clientX);
    }
    
    function onStartControl() {
        controlActive = true;
    }
    
    function onEndControl() {
        controlActive = false;
    }
    
    // Привязка событий
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('mousedown', onStartControl);
    canvas.addEventListener('mouseup', onEndControl);
    canvas.addEventListener('touchstart', onStartControl);
    canvas.addEventListener('touchend', onEndControl);
    
    startBtn.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate(50);
        startGame();
    });
    restartBtn.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate(50);
        restartGame();
    });
    
    // Останавливаем игру при уходе с вкладки Профиль
    const originalNavSetup = setupNavigation;
    window.setupNavigation = function() {
        if (originalNavSetup) originalNavSetup();
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const target = this.getAttribute('data-section');
                if (target !== 'profile-section') {
                    if (gameRunning) stopGame();
                }
            });
        });
    };
    if (typeof setupNavigation === 'function') setupNavigation();
    
    // Начальная отрисовка без игры
    draw();
    
    // Обновление цветов при смене темы (перерисовка)
    const observer = new MutationObserver(() => draw());
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();
