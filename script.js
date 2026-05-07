// ==================== КОНФИГУРАЦИЯ ====================
const BOT_USERNAME = 'khadron_bot';
let currentUserId = null;

// Адрес вашего Cloudflare Worker (замените, если нужно)
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
        linkCopied: "Ссылка скопирована!",
        go: "Перейти",
        game2048: "2048",
        score: "Счёт",
        best: "Лучший",
        newGame: "Новая игра",
        swipeHint: "👆 Свайпайте или используйте стрелки",
        gameWin: "Победа! 🎉",
        gameLose: "Конец игры 😔"
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
        linkCopied: "Link copied!",
        go: "Go",
        game2048: "2048",
        score: "Score",
        best: "Best",
        newGame: "New Game",
        swipeHint: "👆 Swipe or use arrows",
        gameWin: "You win! 🎉",
        gameLose: "Game over 😔"
    }
};

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================
document.addEventListener('DOMContentLoaded', function() {
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
    // Новые функции
    initDailyBonus();
    loadAchievements();
    initReferralSystem();
    initWheelOfFortune();
    initLeaderboard();
    initSkinShop();
    setTimeout(() => document.body.style.opacity = '1', 100);
}

function initializeTelegramWebApp() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        // Apply theme colors if available
        console.log('✅ Telegram WebApp инициализирован');
    } else {
        console.log('⚠️ Telegram WebApp недоступен');
    }
}

// Игры и биржи (рендер)
function initializeGames() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;
    grid.innerHTML = GAMES_DATA.map(game => `
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
            <button class="play-button" data-link="${game.fullLink}">${getTranslation('play')}</button>
        </div>
    `).join('');
    setupGameButtons();
    // Search filter
    document.getElementById('games-search').addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.game-card').forEach(card => {
            const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
            card.style.display = name.includes(q) ? 'flex' : 'none';
        });
    });
}

function initializeExchanges() {
    const list = document.getElementById('exchanges-list');
    if (!list) return;
    list.innerHTML = EXCHANGES_DATA.map(ex => `
        <div class="exchange-card" data-exchange-id="${ex.id}">
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
    setupExchangeButtons();
}

function generateStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    let stars = '';
    for (let i = 0; i < full; i++) stars += '<span class="star filled">★</span>';
    if (half) stars += '<span class="star half">★</span>';
    for (let i = 0; i < empty; i++) stars += '<span class="star">★</span>';
    return stars;
}

function loadUserData() {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        updateProfileDisplay(user);
        currentUserId = user.id;
        sendUserStat(user);
    } else {
        showFallbackProfile();
        currentUserId = null;
    }
}

function updateProfileDisplay(user) {
    document.getElementById('user-name').textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    document.getElementById('user-username').textContent = user.username ? '@' + user.username : 'Telegram User';
    const avatarImg = document.getElementById('avatar-img');
    const avatarFallback = document.getElementById('avatar-fallback');
    if (user.photo_url) {
        avatarImg.src = user.photo_url;
        avatarImg.style.display = 'block';
        avatarFallback.style.display = 'none';
    } else {
        avatarImg.style.display = 'none';
        avatarFallback.textContent = user.first_name?.charAt(0)?.toUpperCase() || 'T';
        avatarFallback.style.display = 'flex';
    }
}

function showFallbackProfile() {
    document.getElementById('user-name').textContent = 'Пользователь';
    document.getElementById('user-username').textContent = 'Открой в Telegram';
    document.getElementById('avatar-fallback').textContent = 'T';
    document.getElementById('avatar-fallback').style.display = 'flex';
}

async function sendUserStat(user) {
    if (!user?.id) return;
    const date = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    const message = `🆕 Новый пользователь в Games Verse\n👤 ${user.first_name || ''} ${user.last_name || ''}\n🆔 ${user.id}\nUsername: ${user.username || 'нет'}\n⭐ Premium: ${user.is_premium ? 'Да' : 'Нет'}\n📅 ${date}`;
    try {
        await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, chatId: '6823288584' })
        });
    } catch (e) { console.error('Stat error:', e); }
}

// Навигация
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-section');
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            if (target === 'profile-section') {
                document.querySelector('.header').style.display = 'none';
            } else {
                document.querySelector('.header').style.display = 'block';
            }
            vibrate();
        });
    });
    // Initial state
    if (document.querySelector('.content-section.active')?.id === 'profile-section') {
        document.querySelector('.header').style.display = 'none';
    }
}

function setupGameButtons() {
    document.querySelectorAll('.play-button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            vibrate();
            const link = this.dataset.link;
            if (link) openLink(link);
        });
    });
}

function setupExchangeButtons() {
    document.querySelectorAll('.exchange-button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            vibrate();
            const url = this.dataset.url;
            if (url) {
                trackReferralClick(this.closest('.exchange-card')?.dataset.exchangeId);
                openLink(url);
            }
        });
    });
}

function openLink(url) {
    if (window.Telegram?.WebApp) {
        if (url.startsWith('https://t.me/')) window.Telegram.WebApp.openTelegramLink(url);
        else window.Telegram.WebApp.openLink(url);
    } else window.open(url, '_blank');
}

// Settings
function setupSettingsPanel() {
    document.getElementById('settings-button').addEventListener('click', () => {
        document.getElementById('settings-panel').classList.add('active'); vibrate();
    });
    document.getElementById('close-settings').addEventListener('click', () => {
        document.getElementById('settings-panel').classList.remove('active'); vibrate();
    });
    document.getElementById('settings-panel').addEventListener('click', e => {
        if (e.target === document.getElementById('settings-panel')) document.getElementById('settings-panel').classList.remove('active');
    });
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.addEventListener('click', function() {
            const theme = this.dataset.theme;
            document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            document.body.classList.toggle('dark-theme', theme === 'dark');
            localStorage.setItem('theme', theme);
            vibrate();
        });
    });
    document.querySelectorAll('.language-option').forEach(opt => {
        opt.addEventListener('click', function() {
            const lang = this.dataset.lang;
            document.querySelectorAll('.language-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            setLanguage(lang);
            localStorage.setItem('language', lang);
            vibrate();
        });
    });
}

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[lang]?.[key]) el.textContent = translations[lang][key];
    });
}

function getTranslation(key) {
    const lang = localStorage.getItem('language') || 'ru';
    return translations[lang]?.[key] || key;
}

function loadThemePreference() {
    const saved = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', saved === 'dark');
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === saved);
    });
}

function loadLanguagePreference() {
    const saved = localStorage.getItem('language') || 'ru';
    setLanguage(saved);
    document.querySelectorAll('.language-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === saved);
    });
}

// Sharing
function setupShareButton() {
    const btn = document.getElementById('share-friends-button');
    if (!btn) return;
    btn.addEventListener('click', function() {
        vibrate();
        let url = `https://t.me/${BOT_USERNAME}`;
        if (currentUserId) url += `?start=ref_${currentUserId}`;
        const text = 'Играй в лучшие мини-игры Telegram вместе с HADRON! 🎮';
        if (navigator.share) {
            navigator.share({ title: 'Games Verse', text, url }).catch(() => fallbackCopy(url));
        } else if (window.Telegram?.WebApp) {
            const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            window.Telegram.WebApp.openTelegramLink(shareUrl);
        } else fallbackCopy(url);
    });
}

function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    showNotification(getTranslation('linkCopied'));
}

function showNotification(msg) {
    const notif = document.getElementById('notification');
    notif.textContent = msg || getTranslation('linkCopied');
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 2000);
}

// ==================== НОВЫЕ ФУНКЦИИ ====================

// Ежедневный бонус
function initDailyBonus() {
    const claimBtn = document.getElementById('daily-claim-btn');
    const coinsSpan = document.getElementById('coins-balance');
    const streakSpan = document.getElementById('daily-streak');
    if (!claimBtn) return;
    updateDailyUI();
    claimBtn.addEventListener('click', () => {
        vibrate();
        const today = new Date().toDateString();
        const last = localStorage.getItem('lastDaily') || '';
        if (last === today) {
            showNotification('Уже получен сегодня!');
            return;
        }
        let streak = parseInt(localStorage.getItem('dailyStreak') || '0');
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (last === yesterday) streak++;
        else streak = 1;
        const reward = 10 + streak * 2;
        let coins = parseInt(localStorage.getItem('coins') || '0');
        coins += reward;
        localStorage.setItem('lastDaily', today);
        localStorage.setItem('dailyStreak', streak);
        localStorage.setItem('coins', coins);
        updateDailyUI();
        showNotification(`+${reward} монет! (день ${streak})`);
        checkAchievements(); // проверим достижения
    });
}

function updateDailyUI() {
    const today = new Date().toDateString();
    const last = localStorage.getItem('lastDaily') || '';
    const claimBtn = document.getElementById('daily-claim-btn');
    if (claimBtn) claimBtn.disabled = (last === today);
    document.getElementById('coins-balance').textContent = localStorage.getItem('coins') || '0';
    document.getElementById('daily-streak').textContent = localStorage.getItem('dailyStreak') || '0';
}

// Реферальная программа
function initReferralSystem() {
    // Проверить, пришли ли по реферальной ссылке
    if (window.Telegram?.WebApp?.initDataUnsafe?.start_param) {
        const params = new URLSearchParams(window.Telegram.WebApp.initDataUnsafe.start_param);
        const ref = params.get('ref');
        if (ref && !localStorage.getItem('referredBy')) {
            localStorage.setItem('referredBy', ref);
            // Увеличить счётчик у себя (или у пригласившего невозможно без сервера)
            // Просто запомним, что мы пришли по ссылке
        }
    }
    // Отображение количества приглашённых (имитация — храним в localStorage)
    const refCount = localStorage.getItem('myReferrals') ? JSON.parse(localStorage.getItem('myReferrals')).length : 0;
    document.getElementById('ref-count').textContent = refCount;
    // При нажатии "Поделиться" мы запоминаем, что пользователь нажал (для достижения)
    // но реальная реферальная система требует сервера. Пока просто заглушка.
    // Можно добавить кнопку "Я пригласил друга", которая вручную инкрементирует счётчик.
    // Но для простоты оставим так.
}

// Достижения
const ACHIEVEMENTS = [
    { id: 'first_game', title: 'Первая игра', desc: 'Сыграть в 2048' },
    { id: 'tile_1024', title: 'Плитка 1024', desc: 'Собрать 1024' },
    { id: 'tile_2048', title: '2048!', desc: 'Выиграть игру' },
    { id: 'explorer', title: 'Исследователь', desc: 'Открыть все биржи' },
    { id: 'social', title: 'Социальный', desc: 'Поделиться с другом' },
    { id: 'daily_streak7', title: '7 дней подряд', desc: 'Заходить 7 дней' },
];

function loadAchievements() {
    const unlocked = JSON.parse(localStorage.getItem('achievements') || '[]');
    const container = document.getElementById('achievements-list');
    if (!container) return;
    container.innerHTML = ACHIEVEMENTS.map(a => `
        <div class="achievement-item">
            <div>
                <strong>${a.title}</strong>
                <div style="font-size:11px; color:gray">${a.desc}</div>
            </div>
            <span>${unlocked.includes(a.id) ? '✅' : '🔒'}</span>
        </div>
    `).join('');
}

function unlockAchievement(id) {
    const unlocked = JSON.parse(localStorage.getItem('achievements') || '[]');
    if (!unlocked.includes(id)) {
        unlocked.push(id);
        localStorage.setItem('achievements', JSON.stringify(unlocked));
        loadAchievements();
        showNotification(`🏆 Новое достижение: ${ACHIEVEMENTS.find(a => a.id === id)?.title}`);
    }
}

function checkAchievements() {
    // Здесь можно проверять условия. Пока вызывается из ключевых мест.
    const streak = parseInt(localStorage.getItem('dailyStreak') || '0');
    if (streak >= 7) unlockAchievement('daily_streak7');
}

// Колесо фортуны
function initWheelOfFortune() {
    const btn = document.getElementById('spin-wheel-btn');
    const resultDiv = document.getElementById('wheel-result');
    btn.addEventListener('click', () => {
        const lastSpin = localStorage.getItem('lastWheelSpin');
        const today = new Date().toDateString();
        if (lastSpin === today) {
            showNotification('Колесо раз в день!');
            return;
        }
        vibrate();
        const prizes = [5, 10, 20, 'Скин Неон', 'Удвоение монет завтра'];
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        localStorage.setItem('lastWheelSpin', today);
        if (typeof prize === 'number') {
            let coins = parseInt(localStorage.getItem('coins') || '0');
            coins += prize;
            localStorage.setItem('coins', coins);
            updateDailyUI();
            resultDiv.textContent = `Вы выиграли ${prize} 🪙`;
        } else if (prize === 'Скин Неон') {
            // даём скин неон (просто разблокируем)
            localStorage.setItem('unlockedSkins', JSON.stringify(['neon']));
            initSkinShop(); // обновить доступность
            resultDiv.textContent = 'Вы получили скин "Неон"!';
        } else {
            resultDiv.textContent = 'Завтра бонус удвоен!';
        }
        showNotification('Колесо закручено!');
    });
}

// Лидерборд 2048 (облачное хранилище)
async function initLeaderboard() {
    const saveBtn = document.getElementById('save-score-btn');
    const loadBtn = document.getElementById('load-lb-btn');
    saveBtn.addEventListener('click', async () => {
        if (!game2048) return;
        const score = game2048.score;
        const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (!user || !window.Telegram?.WebApp?.CloudStorage) {
            showNotification('Нет облачного хранилища');
            return;
        }
        const key = 'leaderboard_2048';
        const data = await getCloudItem(key) || {};
        const uid = user.id.toString();
        if (!data[uid] || data[uid].score < score) {
            data[uid] = { name: user.first_name, score };
            await setCloudItem(key, data);
            showNotification('Результат сохранён!');
        }
    });
    loadBtn.addEventListener('click', async () => {
        if (!window.Telegram?.WebApp?.CloudStorage) return;
        const data = await getCloudItem('leaderboard_2048') || {};
        const arr = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        arr.sort((a, b) => b.score - a.score);
        const html = arr.slice(0, 10).map((e, i) => `<div>${i+1}. ${e.name}: ${e.score}</div>`).join('');
        document.getElementById('leaderboard-table').innerHTML = html || 'Нет данных';
    });
}

async function getCloudItem(key) {
    return new Promise(resolve => {
        window.Telegram.WebApp.CloudStorage.getItem(key, (err, value) => {
            if (err) { console.error(err); resolve(null); }
            else resolve(value ? JSON.parse(value) : null);
        });
    });
}
async function setCloudItem(key, value) {
    return new Promise(resolve => {
        window.Telegram.WebApp.CloudStorage.setItem(key, JSON.stringify(value), resolve);
    });
}

// Магазин скинов
function initSkinShop() {
    const currentSkin = localStorage.getItem('2048_skin') || 'default';
    const unlockedSkins = JSON.parse(localStorage.getItem('unlockedSkins') || '[]');
    document.querySelectorAll('.skin-option').forEach(btn => {
        const skin = btn.dataset.skin;
        btn.classList.toggle('active', skin === currentSkin);
        // Проверка покупки
        if (skin !== 'default' && !unlockedSkins.includes(skin)) {
            btn.disabled = true;
            btn.textContent = btn.textContent.replace(/\(\d+ 🪙\)/, `(${skin === 'neon' ? 50 : 100} 🪙)`);
            btn.addEventListener('click', () => purchaseSkin(skin));
        } else {
            btn.disabled = false;
            btn.addEventListener('click', () => selectSkin(skin));
        }
    });
}

function selectSkin(skin) {
    localStorage.setItem('2048_skin', skin);
    document.querySelectorAll('.skin-option').forEach(b => b.classList.remove('active'));
    document.querySelector(`.skin-option[data-skin="${skin}"]`).classList.add('active');
}

function purchaseSkin(skin) {
    const price = skin === 'neon' ? 50 : 100;
    let coins = parseInt(localStorage.getItem('coins') || '0');
    if (coins < price) {
        showNotification('Недостаточно монет');
        return;
    }
    coins -= price;
    localStorage.setItem('coins', coins);
    const unlocked = JSON.parse(localStorage.getItem('unlockedSkins') || '[]');
    unlocked.push(skin);
    localStorage.setItem('unlockedSkins', JSON.stringify(unlocked));
    updateDailyUI();
    initSkinShop(); // перезагрузить кнопки
    selectSkin(skin);
    showNotification('Скин куплен!');
}

// Отслеживание переходов по рефералам
function trackReferralClick(exchangeId) {
    let clicks = JSON.parse(localStorage.getItem('refClicks') || '{}');
    clicks[exchangeId] = (clicks[exchangeId] || 0) + 1;
    localStorage.setItem('refClicks', JSON.stringify(clicks));
    // Проверка достижения "Исследователь"
    const allIds = EXCHANGES_DATA.map(e => e.id);
    if (allIds.every(id => clicks[id] > 0)) {
        unlockAchievement('explorer');
    }
}

// ==================== 2048 GAME ====================
class Game2048 {
    constructor(boardEl, scoreEl, bestEl, statusEl) {
        this.boardEl = boardEl;
        this.scoreEl = scoreEl;
        this.bestEl = bestEl;
        this.statusEl = statusEl;
        this.size = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore2048') || '0');
        this.plays = parseInt(localStorage.getItem('plays2048') || '0');
        this.maxTile = parseInt(localStorage.getItem('maxTile2048') || '0');
        this.updateBestUI();
        this.init();
        this.setupEvents();
    }

    init() {
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.updateScoreUI();
        this.statusEl.textContent = '';
        this.addRandomTile();
        this.addRandomTile();
        this.render();
    }

    addRandomTile() {
        const empty = [];
        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.size; j++)
                if (this.grid[i][j] === 0) empty.push({x: i, y: j});
        if (empty.length > 0) {
            const {x, y} = empty[Math.floor(Math.random() * empty.length)];
            this.grid[x][y] = Math.random() < 0.9 ? 2 : 4;
            this.lastAdded = {x, y};
            return true;
        }
        return false;
    }

    render() {
        this.boardEl.innerHTML = '';
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const val = this.grid[i][j];
                const tile = document.createElement('div');
                tile.className = 'tile-cell';
                if (val !== 0) {
                    let cls = `tile-${val}`;
                    if (val > 2048) cls = 'tile-super';
                    tile.classList.add(cls);
                    tile.textContent = val;
                    if (this.lastAdded && this.lastAdded.x === i && this.lastAdded.y === j) {
                        tile.classList.add('tile-new');
                        setTimeout(() => tile.classList.remove('tile-new'), 200);
                    }
                    if (val > this.maxTile) {
                        this.maxTile = val;
                        localStorage.setItem('maxTile2048', this.maxTile);
                        checkAchievements(); // возможно, разблокируем
                    }
                }
                this.boardEl.appendChild(tile);
            }
        }
        this.lastAdded = null;
    }

    updateScoreUI() {
        this.scoreEl.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore2048', this.bestScore);
            this.updateBestUI();
        }
    }

    updateBestUI() {
        this.bestEl.textContent = this.bestScore;
    }

    slide(row) {
        let arr = row.filter(v => v !== 0);
        let newRow = [];
        let scoreGain = 0;
        for (let i = 0; i < arr.length; i++) {
            if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
                const merged = arr[i] * 2;
                newRow.push(merged);
                scoreGain += merged;
                i++;
            } else {
                newRow.push(arr[i]);
            }
        }
        while (newRow.length < this.size) newRow.push(0);
        return {newRow, scoreGain};
    }

    move(dir) {
        let oldGrid = JSON.parse(JSON.stringify(this.grid));
        let totalGain = 0;
        if (dir === 'left') {
            for (let i = 0; i < this.size; i++) {
                let {newRow, scoreGain} = this.slide(this.grid[i]);
                this.grid[i] = newRow;
                totalGain += scoreGain;
            }
        } else if (dir === 'right') {
            for (let i = 0; i < this.size; i++) {
                let reversed = [...this.grid[i]].reverse();
                let {newRow, scoreGain} = this.slide(reversed);
                totalGain += scoreGain;
                this.grid[i] = newRow.reverse();
            }
        } else if (dir === 'up') {
            for (let j = 0; j < this.size; j++) {
                let col = [];
                for (let i = 0; i < this.size; i++) col.push(this.grid[i][j]);
                let {newRow, scoreGain} = this.slide(col);
                totalGain += scoreGain;
                for (let i = 0; i < this.size; i++) this.grid[i][j] = newRow[i];
            }
        } else if (dir === 'down') {
            for (let j = 0; j < this.size; j++) {
                let col = [];
                for (let i = 0; i < this.size; i++) col.push(this.grid[i][j]);
                let reversed = col.reverse();
                let {newRow, scoreGain} = this.slide(reversed);
                totalGain += scoreGain;
                let final = newRow.reverse();
                for (let i = 0; i < this.size; i++) this.grid[i][j] = final[i];
            }
        }
        if (totalGain > 0) {
            this.score += totalGain;
            this.updateScoreUI();
        }
        let changed = false;
        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.size; j++)
                if (oldGrid[i][j] !== this.grid[i][j]) changed = true;
        if (changed) {
            this.addRandomTile();
            this.render();
            if (this.checkWin()) {
                this.statusEl.textContent = getTranslation('gameWin');
                unlockAchievement('tile_2048');
            } else if (this.checkLose()) {
                this.statusEl.textContent = getTranslation('gameLose');
            }
            // Увеличиваем счётчик игр
            this.plays++;
            localStorage.setItem('plays2048', this.plays);
            if (this.plays === 1) unlockAchievement('first_game');
        }
    }

    checkWin() {
        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.size; j++)
                if (this.grid[i][j] === 2048) return true;
        return false;
    }

    checkLose() {
        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.size; j++)
                if (this.grid[i][j] === 0) return false;
        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.size; j++) {
                const val = this.grid[i][j];
                if (j < this.size-1 && val === this.grid[i][j+1]) return false;
                if (i < this.size-1 && val === this.grid[i+1][j]) return false;
            }
        return true;
    }

    setupEvents() {
        let startX, startY;
        this.boardEl.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            e.preventDefault();
        });
        this.boardEl.addEventListener('touchend', e => {
            if (!startX || !startY) return;
            const dx = e.changedTouches[0].clientX - startX;
            const dy = e.changedTouches[0].clientY - startY;
            if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
            if (Math.abs(dx) > Math.abs(dy)) this.move(dx > 0 ? 'right' : 'left');
            else this.move(dy > 0 ? 'down' : 'up');
            startX = startY = 0;
            vibrate();
        });
        window.addEventListener('keydown', e => {
            if (!document.getElementById('profile-section')?.classList.contains('active')) return;
            const key = e.key;
            if (key === 'ArrowLeft') { this.move('left'); e.preventDefault(); vibrate(); }
            else if (key === 'ArrowRight') { this.move('right'); e.preventDefault(); vibrate(); }
            else if (key === 'ArrowUp') { this.move('up'); e.preventDefault(); vibrate(); }
            else if (key === 'ArrowDown') { this.move('down'); e.preventDefault(); vibrate(); }
        });
    }

    resetGame() {
        this.init();
        this.render();
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
            vibrate();
            game2048.resetGame();
        });
    }
}

// Запускаем 2048 после загрузки
setTimeout(initGame2048, 300);
