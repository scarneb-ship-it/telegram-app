// ==================== КОНФИГУРАЦИЯ ====================
const BOT_USERNAME = 'khadron_bot';
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

const translations = {
    ru: {
        appTitle: "Games Verse", settings: "Настройки", theme: "Тема",
        lightTheme: "Светлая", darkTheme: "Темная", language: "Язык",
        russian: "Русский", english: "English", done: "Готово",
        games: "Игры", bestGames: "Лучшие игры Telegram", play: "Играть",
        exchanges: "Биржи", exchangesDesc: "Торгуйте криптовалютами безопасно",
        user: "Пользователь", shareWithFriends: "Поделиться с друзьями",
        profile: "Профиль", linkCopied: "Ссылка скопирована!",
        go: "Перейти", promoCodeCopied: "Промокод HADRON скопирован! 🎁",
        score: "Счёт", best: "Рекорд", newGame: "Новая игра"
    },
    en: {
        appTitle: "Games Verse", settings: "Settings", theme: "Theme",
        lightTheme: "Light", darkTheme: "Dark", language: "Language",
        russian: "Russian", english: "English", done: "Done",
        games: "Games", bestGames: "Best Telegram Games", play: "Play",
        exchanges: "Exchanges", exchangesDesc: "Trade cryptocurrencies safely",
        user: "User", shareWithFriends: "Share with friends",
        profile: "Profile", linkCopied: "Link copied!",
        go: "Go", promoCodeCopied: "Promo code HADRON copied! 🎁",
        score: "Score", best: "Best", newGame: "New Game"
    }
};

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function vibrate() { if (navigator.vibrate) navigator.vibrate(50); }

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
    setupPromoMarquee();
    initGame2048();  // Запуск игры
    setTimeout(() => document.body.style.opacity = '1', 100);
}

function initializeTelegramWebApp() {
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        const tp = tg.themeParams;
        if (tp) {
            if (tp.bg_color) document.documentElement.style.setProperty('--tg-theme-bg-color', tp.bg_color);
            if (tp.text_color) document.documentElement.style.setProperty('--tg-theme-text-color', tp.text_color);
            if (tp.button_color) document.documentElement.style.setProperty('--tg-theme-button-color', tp.button_color);
            if (tp.button_text_color) document.documentElement.style.setProperty('--tg-theme-button-text-color', tp.button_text_color);
        }
    }
}

function initializeGames() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;
    grid.innerHTML = GAMES_DATA.map(game => `
        <div class="game-card ${game.highlight ? 'highlight' : ''}">
            <div class="game-image">
                <img src="${game.image}" alt="${game.name}" class="game-img" onerror="this.style.display='none'">
                <div class="image-fallback">${game.fallback}</div>
            </div>
            <div class="game-info">
                <div class="game-header"><h3>${game.name}</h3>${game.badge ? `<span class="game-badge">${game.badge}</span>` : ''}</div>
                <p class="game-description">${game.description}</p>
                <div class="game-stats"><div class="rating"><div class="stars">${generateStars(game.rating)}</div><span class="rating-value">${game.rating}</span></div><div class="players"><span class="players-icon">👥</span><span class="players-count">${game.players}</span></div></div>
            </div>
            <button class="play-button" data-link="${game.fullLink}">${getTranslation('play')}</button>
        </div>
    `).join('');
    document.querySelectorAll('.play-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            vibrate();
            const link = btn.getAttribute('data-link');
            if (link) window.Telegram?.WebApp ? window.Telegram.WebApp.openTelegramLink(link) : window.open(link, '_blank');
        });
    });
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) stars += `<span class="star ${i <= rating ? 'filled' : ''}">★</span>`;
    return stars;
}

function initializeExchanges() {
    const list = document.getElementById('exchanges-list');
    if (!list) return;
    list.innerHTML = EXCHANGES_DATA.map(ex => `
        <div class="exchange-card">
            <div class="exchange-logo"><img src="${ex.image}" alt="${ex.name}" class="exchange-img" onerror="this.style.display='none'"><div class="image-fallback">${ex.fallback}</div></div>
            <div class="exchange-info"><h3>${ex.name}</h3><p>${ex.description}</p></div>
            <button class="exchange-button" data-url="${ex.url}">${getTranslation('go')}</button>
        </div>
    `).join('');
    document.querySelectorAll('.exchange-button').forEach(btn => {
        btn.addEventListener('click', () => {
            vibrate();
            const url = btn.getAttribute('data-url');
            if (url) window.Telegram?.WebApp ? window.Telegram.WebApp.openLink(url) : window.open(url, '_blank');
        });
    });
}

function loadUserData() {
    const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (user) {
        document.getElementById('user-name').textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
        document.getElementById('user-username').textContent = user.username ? '@' + user.username : 'Telegram User';
        const avatarImg = document.getElementById('avatar-img');
        const fallback = document.getElementById('avatar-fallback');
        if (user.photo_url) {
            avatarImg.src = user.photo_url;
            avatarImg.style.display = 'block';
            fallback.style.display = 'none';
        } else {
            fallback.textContent = user.first_name?.charAt(0).toUpperCase() || 'T';
        }
        if (user.is_premium && !document.querySelector('.premium-badge')) {
            const badge = document.createElement('div');
            badge.className = 'premium-badge';
            badge.innerHTML = '⭐ Premium';
            document.querySelector('.profile-info').appendChild(badge);
        }
        currentUserId = user.id;
    } else {
        document.getElementById('user-name').textContent = 'Telegram User';
        document.getElementById('user-username').textContent = 'Открой в Telegram';
        document.getElementById('avatar-fallback').textContent = 'T';
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            vibrate();
            const target = item.getAttribute('data-section');
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(target).classList.add('active');
        });
    });
}

function setupSettingsPanel() {
    const btn = document.getElementById('settings-button');
    const panel = document.getElementById('settings-panel');
    const close = document.getElementById('close-settings');
    btn.onclick = () => { vibrate(); panel.classList.add('active'); };
    close.onclick = () => { vibrate(); panel.classList.remove('active'); };
    panel.onclick = (e) => { if (e.target === panel) panel.classList.remove('active'); };
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.onclick = () => {
            vibrate();
            const theme = opt.getAttribute('data-theme');
            document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            if (theme === 'dark') document.body.classList.add('dark-theme');
            else document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', theme);
        };
    });
    document.querySelectorAll('.language-option').forEach(opt => {
        opt.onclick = () => {
            vibrate();
            const lang = opt.getAttribute('data-lang');
            document.querySelectorAll('.language-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            setLanguage(lang);
            localStorage.setItem('language', lang);
        };
    });
}

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang]?.[key]) el.textContent = translations[lang][key];
    });
}

function getTranslation(key) {
    const lang = localStorage.getItem('language') || 'ru';
    return translations[lang]?.[key] || key;
}

function loadThemePreference() {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') document.body.classList.add('dark-theme');
    document.querySelector(`.theme-option[data-theme="${theme}"]`)?.classList.add('active');
}

function loadLanguagePreference() {
    const lang = localStorage.getItem('language') || 'ru';
    setLanguage(lang);
    document.querySelector(`.language-option[data-lang="${lang}"]`)?.classList.add('active');
}

function setupShareButton() {
    const btn = document.getElementById('share-friends-button');
    btn?.addEventListener('click', () => {
        vibrate();
        const botUrl = currentUserId ? `https://t.me/${BOT_USERNAME}?start=ref_${currentUserId}` : `https://t.me/${BOT_USERNAME}`;
        const shareText = 'Играй в лучшие мини-игры Telegram вместе с HADRON! 🎮';
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(botUrl)}&text=${encodeURIComponent(shareText)}`);
        } else if (navigator.share) {
            navigator.share({ title: 'Games Verse', text: shareText, url: botUrl });
        } else {
            fallbackCopyToClipboard(botUrl);
        }
    });
}

function setupPromoMarquee() {
    const promo = document.getElementById('promoMarquee');
    promo?.addEventListener('click', () => {
        vibrate();
        fallbackCopyToClipboard('HADRON');
        const lang = localStorage.getItem('language') || 'ru';
        showCustomNotification(translations[lang].promoCodeCopied);
    });
}

function fallbackCopyToClipboard(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showCustomNotification(getTranslation('linkCopied'));
}

function showCustomNotification(msg) {
    const notif = document.getElementById('notification');
    notif.textContent = msg;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 2000);
}

// ==================== ИГРА 2048 ====================
let board = [];
let score = 0;
let bestScore = 0;

function initGame2048() {
    const savedBest = localStorage.getItem('2048_best');
    if (savedBest) bestScore = parseInt(savedBest);
    document.getElementById('game-best').innerText = bestScore;
    newGame();
    document.getElementById('new-game-btn').addEventListener('click', () => newGame());
    document.addEventListener('keydown', handleKeyPress);
    let touchStartX = 0, touchStartY = 0;
    const boardEl = document.getElementById('game-board');
    boardEl.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    boardEl.addEventListener('touchend', (e) => {
        if (!touchStartX) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) moveRight();
            else moveLeft();
        } else {
            if (dy > 0) moveDown();
            else moveUp();
        }
        touchStartX = 0;
    });
}

function newGame() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    updateScoreUI();
    addRandomTile();
    addRandomTile();
    renderBoard();
}

function addRandomTile() {
    const empty = [];
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            if (board[i][j] === 0) empty.push([i, j]);
    if (empty.length === 0) return;
    const [row, col] = empty[Math.floor(Math.random() * empty.length)];
    board[row][col] = Math.random() < 0.9 ? 2 : 4;
}

function renderBoard() {
    const container = document.getElementById('game-board');
    container.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const val = board[i][j];
            const tile = document.createElement('div');
            tile.className = `tile tile-${val}`;
            tile.innerText = val !== 0 ? val : '';
            container.appendChild(tile);
        }
    }
}

function moveLeft() {
    let changed = false;
    for (let i = 0; i < 4; i++) {
        let row = board[i].filter(v => v !== 0);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j+1]) {
                row[j] *= 2;
                score += row[j];
                row.splice(j+1, 1);
                changed = true;
            }
        }
        while (row.length < 4) row.push(0);
        if (JSON.stringify(board[i]) !== JSON.stringify(row)) changed = true;
        board[i] = row;
    }
    if (changed) afterMove();
}

function moveRight() {
    let changed = false;
    for (let i = 0; i < 4; i++) {
        let row = board[i].filter(v => v !== 0);
        for (let j = row.length - 1; j > 0; j--) {
            if (row[j] === row[j-1]) {
                row[j] *= 2;
                score += row[j];
                row.splice(j-1, 1);
                j--;
                changed = true;
            }
        }
        while (row.length < 4) row.unshift(0);
        if (JSON.stringify(board[i]) !== JSON.stringify(row)) changed = true;
        board[i] = row;
    }
    if (changed) afterMove();
}

function moveUp() {
    let changed = false;
    for (let j = 0; j < 4; j++) {
        let col = [];
        for (let i = 0; i < 4; i++) if (board[i][j] !== 0) col.push(board[i][j]);
        for (let k = 0; k < col.length - 1; k++) {
            if (col[k] === col[k+1]) {
                col[k] *= 2;
                score += col[k];
                col.splice(k+1, 1);
                changed = true;
            }
        }
        while (col.length < 4) col.push(0);
        for (let i = 0; i < 4; i++) if (board[i][j] !== col[i]) changed = true;
        for (let i = 0; i < 4; i++) board[i][j] = col[i];
    }
    if (changed) afterMove();
}

function moveDown() {
    let changed = false;
    for (let j = 0; j < 4; j++) {
        let col = [];
        for (let i = 0; i < 4; i++) if (board[i][j] !== 0) col.push(board[i][j]);
        for (let k = col.length - 1; k > 0; k--) {
            if (col[k] === col[k-1]) {
                col[k] *= 2;
                score += col[k];
                col.splice(k-1, 1);
                k--;
                changed = true;
            }
        }
        while (col.length < 4) col.unshift(0);
        for (let i = 0; i < 4; i++) if (board[i][j] !== col[i]) changed = true;
        for (let i = 0; i < 4; i++) board[i][j] = col[i];
    }
    if (changed) afterMove();
}

function afterMove() {
    updateScoreUI();
    addRandomTile();
    renderBoard();
    if (isGameOver()) {
        setTimeout(() => alert(getTranslation('gameOver') || 'Game Over!'), 50);
    }
}

function updateScoreUI() {
    document.getElementById('game-score').innerText = score;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('2048_best', bestScore);
        document.getElementById('game-best').innerText = bestScore;
    }
}

function isGameOver() {
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            if (board[i][j] === 0) return false;
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 3; j++)
            if (board[i][j] === board[i][j+1] || board[j][i] === board[j+1][i]) return false;
    return true;
}

function handleKeyPress(e) {
    const key = e.key;
    if (key === 'ArrowLeft') moveLeft();
    else if (key === 'ArrowRight') moveRight();
    else if (key === 'ArrowUp') moveUp();
    else if (key === 'ArrowDown') moveDown();
}
