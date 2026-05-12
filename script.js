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
        blockBlast: "Block Blast",
        score: "Счёт",
        best: "Лучший",
        newGame: "Новая игра",
        blockHint: "👆 Выберите блок и нажмите на сетку"
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
        blockBlast: "Block Blast",
        score: "Score",
        best: "Best",
        newGame: "New Game",
        blockHint: "👆 Select a block and tap the grid"
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
            // ОТПРАВКА СТАТИСТИКИ
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
                chatId: '6823288584'   // ваш Telegram ID
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

// ==================== BLOCK BLAST GAME ====================
class BlockBlast {
    constructor(boardElement, blocksElement, scoreElement, bestScoreElement) {
        this.boardElement = boardElement;
        this.blocksElement = blocksElement;
        this.scoreElement = scoreElement;
        this.bestScoreElement = bestScoreElement;
        this.gridSize = 8;
        this.grid = [];
        this.score = 0;
        this.bestScore = localStorage.getItem('bestScoreBlockBlast') ? parseInt(localStorage.getItem('bestScoreBlockBlast')) : 0;
        this.blocks = [];
        this.selectedBlockIndex = null;
        this.updateBestScoreUI();
        this.init();
    }

    // Все возможные фигуры (полимино)
    shapes = [
        [[0,0],[0,1],[0,2]],
        [[0,0],[1,0],[2,0],[2,1]],
        [[0,0],[0,1],[1,0],[1,1]],
        [[0,0],[0,1],[0,2],[1,1]],
        [[0,0],[0,1],[1,1],[1,2]],
        [[0,1],[0,2],[1,0],[1,1]],
        [[0,0],[0,1],[0,2],[0,3]],
        [[0,0],[1,0],[2,0],[2,1]],
        [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]],
        [[0,0],[0,1],[0,2],[0,3],[0,4]]
    ];

    init() {
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
        this.score = 0;
        this.updateScoreUI();
        this.blocks = this.generateThreeBlocks();
        this.selectedBlockIndex = null;
        this.render();
    }

    generateThreeBlocks() {
        const blocks = [];
        for (let i = 0; i < 3; i++) {
            const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
            blocks.push({ shape: shape.map(cell => [...cell]), color: '#f2b179' });
        }
        return blocks;
    }

    render() {
        this.renderBoard();
        this.renderBlocks();
    }

    renderBoard() {
        this.boardElement.innerHTML = '';
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'board-cell';
                if (this.grid[row][col] === 1) {
                    cell.classList.add('filled');
                }
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', (e) => this.onBoardClick(row, col));
                this.boardElement.appendChild(cell);
            }
        }
    }

    renderBlocks() {
        this.blocksElement.innerHTML = '';
        this.blocks.forEach((block, index) => {
            const shape = block.shape;
            let minRow = Infinity, maxRow = -Infinity, minCol = Infinity, maxCol = -Infinity;
            shape.forEach(cell => {
                if (cell[0] < minRow) minRow = cell[0];
                if (cell[0] > maxRow) maxRow = cell[0];
                if (cell[1] < minCol) minCol = cell[1];
                if (cell[1] > maxCol) maxCol = cell[1];
            });
            const rows = maxRow - minRow + 1;
            const cols = maxCol - minCol + 1;

            const blockDiv = document.createElement('div');
            blockDiv.className = 'block-option';
            if (this.selectedBlockIndex === index) blockDiv.classList.add('selected');
            blockDiv.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            blockDiv.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const cellDiv = document.createElement('div');
                    cellDiv.className = 'block-preview-cell';
                    const isFilled = shape.some(cell => cell[0] === minRow + r && cell[1] === minCol + c);
                    if (isFilled) cellDiv.classList.add('filled');
                    blockDiv.appendChild(cellDiv);
                }
            }

            blockDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectBlock(index);
            });
            this.blocksElement.appendChild(blockDiv);
        });
    }

    selectBlock(index) {
        if (this.selectedBlockIndex === index) {
            this.selectedBlockIndex = null;
        } else {
            this.selectedBlockIndex = index;
        }
        this.renderBlocks();
    }

    onBoardClick(row, col) {
        if (this.selectedBlockIndex === null) return;
        const block = this.blocks[this.selectedBlockIndex];
        if (!block) return;
        const shape = block.shape;
        let minR = shape[0][0], minC = shape[0][1];
        shape.forEach(cell => {
            if (cell[0] < minR) minR = cell[0];
            if (cell[1] < minC) minC = cell[1];
        });

        const offsetR = row - minR;
        const offsetC = col - minC;

        if (this.canPlaceBlock(shape, offsetR, offsetC)) {
            this.placeBlock(shape, offsetR, offsetC);
            this.blocks.splice(this.selectedBlockIndex, 1);
            this.selectedBlockIndex = null;
            if (this.blocks.length < 3) {
                const newShape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
                this.blocks.push({ shape: newShape.map(cell => [...cell]), color: '#f2b179' });
            }
            this.render();
            if (this.checkGameOver()) {
                setTimeout(() => alert('Игра окончена! Больше нет доступных ходов.'), 100);
            }
        }
    }

    canPlaceBlock(shape, offsetR, offsetC) {
        for (let [r, c] of shape) {
            const newR = r + offsetR;
            const newC = c + offsetC;
            if (newR < 0 || newR >= this.gridSize || newC < 0 || newC >= this.gridSize) return false;
            if (this.grid[newR][newC] === 1) return false;
        }
        return true;
    }

    placeBlock(shape, offsetR, offsetC) {
        shape.forEach(([r, c]) => {
            this.grid[r + offsetR][c + offsetC] = 1;
        });
        this.clearLines();
    }

    clearLines() {
        let linesCleared = 0;
        for (let row = 0; row < this.gridSize; row++) {
            if (this.grid[row].every(cell => cell === 1)) {
                for (let col = 0; col < this.gridSize; col++) {
                    this.grid[row][col] = 0;
                }
                linesCleared++;
            }
        }
        for (let col = 0; col < this.gridSize; col++) {
            let full = true;
            for (let row = 0; row < this.gridSize; row++) {
                if (this.grid[row][col] !== 1) {
                    full = false;
                    break;
                }
            }
            if (full) {
                for (let row = 0; row < this.gridSize; row++) {
                    this.grid[row][col] = 0;
                }
                linesCleared++;
            }
        }
        if (linesCleared > 0) {
            this.score += linesCleared * 10;
            this.updateScoreUI();
        }
    }

    checkGameOver() {
        for (let block of this.blocks) {
            const shape = block.shape;
            let minR = shape[0][0], minC = shape[0][1];
            shape.forEach(cell => {
                if (cell[0] < minR) minR = cell[0];
                if (cell[1] < minC) minC = cell[1];
            });
            for (let row = 0; row < this.gridSize; row++) {
                for (let col = 0; col < this.gridSize; col++) {
                    const offsetR = row - minR;
                    const offsetC = col - minC;
                    if (this.canPlaceBlock(shape, offsetR, offsetC)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    updateScoreUI() {
        this.scoreElement.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScoreBlockBlast', this.bestScore);
            this.updateBestScoreUI();
        }
    }

    updateBestScoreUI() {
        this.bestScoreElement.textContent = this.bestScore;
    }

    resetGame() {
        this.init();
    }
}

// Инициализация Block Blast после загрузки DOM
let blockBlast = null;
function initBlockBlast() {
    const board = document.getElementById('block-blast-board');
    const blocks = document.getElementById('block-blast-blocks');
    const scoreEl = document.getElementById('block-score');
    const bestEl = document.getElementById('block-best-score');
    if (board && blocks && scoreEl && bestEl && !blockBlast) {
        blockBlast = new BlockBlast(board, blocks, scoreEl, bestEl);
        const newGameBtn = document.getElementById('new-game-btn');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                vibrate();
                blockBlast.resetGame();
            });
        }
    }
}

// Запуск после небольшой задержки, чтобы DOM обновился
setTimeout(() => {
    initBlockBlast();
}, 300);
