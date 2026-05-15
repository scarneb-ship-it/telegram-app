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
    loadUserData();
    setupShareButton();
    initGame2048();
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
                Играть
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
                Перейти
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
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') document.body.classList.add('dark-theme');
    updateSettingsThemeOptions(savedTheme);
}

function updateSettingsThemeOptions(theme) {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-theme') === theme) option.classList.add('active');
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
    else notification.textContent = 'Ссылка скопирована в буфер обмена!';
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 2000);
}

// ==================== 2048 GAME (улучшенная анимация) ====================
class Game2048 {
    constructor(boardElement, scoreElement, bestScoreElement, statusElement) {
        this.boardElement = boardElement;
        this.scoreElement = scoreElement;
        this.bestScoreElement = bestScoreElement;
        this.statusElement = statusElement;
        this.size = 4;
        this.score = 0;
        this.bestScore = localStorage.getItem('bestScore2048') ? parseInt(localStorage.getItem('bestScore2048')) : 0;
        this.tiles = [];          // {id, value, x, y}
        this.nextId = 0;
        this.isAnimating = false;
        this.updateBestScoreUI();
        this.init();
        this.setupSwipeEvents();
        this.setupKeyboardEvents();
    }

    init() {
        this.tiles = [];
        this.score = 0;
        this.updateScoreUI();
        this.statusElement.textContent = '';
        this.addRandomTile();
        this.addRandomTile();
        this.render(true);
    }

    getEmptyCells() {
        const occupied = new Set(this.tiles.map(t => `${t.x},${t.y}`));
        const empty = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (!occupied.has(`${i},${j}`)) empty.push({x: i, y: j});
            }
        }
        return empty;
    }

    addRandomTile() {
        const emptyCells = this.getEmptyCells();
        if (emptyCells.length > 0) {
            const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            this.tiles.push({id: this.nextId++, value, x, y});
        }
    }

    getTileAt(x, y) {
        return this.tiles.find(t => t.x === x && t.y === y);
    }

    render(initial = false) {
        // Удаляем старые DOM элементы плиток, которых больше нет в this.tiles
        const existingIds = new Set(this.tiles.map(t => t.id));
        const children = [...this.boardElement.children];
        children.forEach(child => {
            const id = parseInt(child.dataset.id);
            if (!existingIds.has(id)) {
                child.remove();
            }
        });

        // Обновляем или создаём элементы для каждой плитки
        this.tiles.forEach(tile => {
            let el = this.boardElement.querySelector(`[data-id="${tile.id}"]`);
            if (!el) {
                el = document.createElement('div');
                el.className = 'tile-cell';
                el.dataset.id = tile.id;
                el.classList.add('tile-new');
                this.boardElement.appendChild(el);
                // Убираем класс анимации после завершения
                setTimeout(() => el.classList.remove('tile-new'), 200);
            }

            // Позиция в процентах с учётом gap (gap ~8px, но используем проценты ширины)
            const gapPercent = 2; // примерно 8px от 400px = 2%
            const cellPercent = (100 - gapPercent * (this.size + 1)) / this.size;
            const left = gapPercent + tile.y * (cellPercent + gapPercent);
            const top = gapPercent + tile.x * (cellPercent + gapPercent);

            el.style.left = left + '%';
            el.style.top = top + '%';

            // Обновляем класс значения
            el.className = el.className.replace(/tile-\w+/g, '');
            let tileClass = `tile-${tile.value}`;
            if (tile.value > 2048) tileClass = 'tile-super';
            el.classList.add('tile-cell', tileClass);
            el.textContent = tile.value;

            // Анимация слияния (если плитка только что обновилась)
            if (el.dataset.prevValue && parseInt(el.dataset.prevValue) !== tile.value) {
                el.classList.add('tile-merge');
                setTimeout(() => el.classList.remove('tile-merge'), 200);
            }
            el.dataset.prevValue = tile.value;
        });
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

    move(direction) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        let moved = false;
        let scoreGain = 0;
        const mergedIds = new Set();

        // Обработка линий в зависимости от направления
        const lines = this.getLines(direction);

        lines.forEach(lineTiles => {
            // Сортируем плитки в линии по направлению движения
            const sorted = [...lineTiles].sort((a, b) => {
                if (direction === 'right' || direction === 'down') {
                    return (direction === 'right' ? b.y - a.y : b.x - a.x);
                } else {
                    return (direction === 'left' ? a.y - b.y : a.x - b.x);
                }
            });

            const newLine = [];
            let i = 0;
            while (i < sorted.length) {
                if (i + 1 < sorted.length && sorted[i].value === sorted[i + 1].value && !mergedIds.has(sorted[i].id) && !mergedIds.has(sorted[i+1].id)) {
                    // Слияние
                    const mergedValue = sorted[i].value * 2;
                    sorted[i].value = mergedValue;
                    mergedIds.add(sorted[i].id);
                    mergedIds.add(sorted[i+1].id);
                    scoreGain += mergedValue;
                    newLine.push(sorted[i]);
                    i += 2;
                } else {
                    newLine.push(sorted[i]);
                    i++;
                }
            }

            // Назначаем новые координаты плиткам в линии
            newLine.forEach((tile, index) => {
                let newX, newY;
                if (direction === 'left') {
                    newX = tile.x;
                    newY = index;
                } else if (direction === 'right') {
                    newX = tile.x;
                    newY = this.size - 1 - (newLine.length - 1 - index);
                } else if (direction === 'up') {
                    newX = index;
                    newY = tile.y;
                } else if (direction === 'down') {
                    newX = this.size - 1 - (newLine.length - 1 - index);
                    newY = tile.y;
                }
                if (tile.x !== newX || tile.y !== newY) {
                    tile.x = newX;
                    tile.y = newY;
                    moved = true;
                }
            });
        });

        // Удаляем плитки, которые были поглощены (но оставляем ту, что осталась)
        this.tiles = this.tiles.filter(t => !mergedIds.has(t.id) || mergedIds.has(t.id) && this.tiles.some(t2 => t2.id === t.id && t2.value !== 0));
        // Убираем поглощённые плитки: оставляем только те, чей id не в mergedIds, или если id в mergedIds, то только если значение было обновлено (т.е. плитка-результат)
        const idsToRemove = new Set();
        mergedIds.forEach(id => {
            const tile = this.tiles.find(t => t.id === id);
            if (tile && tile.value % 2 === 0) {
                // Это результат слияния, оставляем
            } else {
                idsToRemove.add(id);
            }
        });
        this.tiles = this.tiles.filter(t => !idsToRemove.has(t.id));

        if (scoreGain > 0) {
            this.score += scoreGain;
            this.updateScoreUI();
        }

        if (moved || scoreGain > 0) {
            this.addRandomTile();
        }

        this.render();

        if (this.checkWin()) {
            this.statusElement.textContent = 'Вы победили! 🎉';
        } else if (this.checkLose()) {
            this.statusElement.textContent = 'Игра окончена! 😔';
        }

        setTimeout(() => { this.isAnimating = false; }, 150);
    }

    getLines(direction) {
        const lines = [];
        if (direction === 'left' || direction === 'right') {
            for (let i = 0; i < this.size; i++) {
                const rowTiles = this.tiles.filter(t => t.x === i);
                if (rowTiles.length > 0) lines.push(rowTiles);
            }
        } else {
            for (let j = 0; j < this.size; j++) {
                const colTiles = this.tiles.filter(t => t.y === j);
                if (colTiles.length > 0) lines.push(colTiles);
            }
        }
        return lines;
    }

    checkWin() {
        return this.tiles.some(t => t.value >= 2048);
    }

    checkLose() {
        if (this.tiles.length < this.size * this.size) return false;
        for (const tile of this.tiles) {
            const neighbors = [
                this.getTileAt(tile.x + 1, tile.y),
                this.getTileAt(tile.x - 1, tile.y),
                this.getTileAt(tile.x, tile.y + 1),
                this.getTileAt(tile.x, tile.y - 1)
            ];
            if (neighbors.some(n => n && n.value === tile.value)) return false;
        }
        return true;
    }

    setupSwipeEvents() {
        let touchStartX = 0, touchStartY = 0;
        this.boardElement.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            e.preventDefault();
        }, {passive: false});
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
            if (document.getElementById('game-section').classList.contains('active')) {
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
