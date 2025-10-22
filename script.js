// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBx7h-_X5YJp-5RBFKvN8QKmZ0qN5VQY2A",
    authDomain: "gamesverse-app.firebaseapp.com",
    databaseURL: "https://gamesverse-app-default-rtdb.firebaseio.com",
    projectId: "gamesverse-app",
    storageBucket: "gamesverse-app.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Telegram Bot Configuration
const BOT_TOKEN = '8437291172:AAEeIYl2BoK4OKr7kjulLX_JiQENXff-cMA';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Translations
const translations = {
    ru: {
        appTitle: "Games Verse",
        appSubtitle: "Твой игровой мир",
        notifications: "Уведомления",
        noNotifications: "Нет новых уведомлений",
        settings: "Настройки",
        theme: "Тема",
        lightTheme: "☀️ Светлая",
        darkTheme: "🌙 Темная",
        language: "Язык",
        russian: "🇷🇺 Русский",
        english: "🇬🇧 English",
        done: "Готово",
        searchPlaceholder: "Поиск игр...",
        allGames: "Все игры",
        popular: "🔥 Популярные",
        new: "✨ Новые",
        action: "⚔️ Экшн",
        casual: "🎲 Казуальные",
        favorites: "❤️ Избранное",
        games: "Игры",
        exchanges: "Биржи",
        exchangesDesc: "Торгуйте криптовалютами безопасно",
        profile: "Профиль",
        user: "Пользователь",
        favoritesCount: "Избранных игр",
        timeSpent: "Времени в приложении",
        shareWithFriends: "Поделиться с друзьями",
        feedback: "Оставить отзыв",
        play: "Играть",
        go: "Перейти",
        linkCopied: "Ссылка скопирована!",
        addedToFavorites: "Добавлено в избранное",
        removedFromFavorites: "Удалено из избранного"
    },
    en: {
        appTitle: "Games Verse",
        appSubtitle: "Your Gaming Universe",
        notifications: "Notifications",
        noNotifications: "No new notifications",
        settings: "Settings",
        theme: "Theme",
        lightTheme: "☀️ Light",
        darkTheme: "🌙 Dark",
        language: "Language",
        russian: "🇷🇺 Russian",
        english: "🇬🇧 English",
        done: "Done",
        searchPlaceholder: "Search games...",
        allGames: "All Games",
        popular: "🔥 Popular",
        new: "✨ New",
        action: "⚔️ Action",
        casual: "🎲 Casual",
        favorites: "❤️ Favorites",
        games: "Games",
        exchanges: "Exchanges",
        exchangesDesc: "Trade cryptocurrencies safely",
        profile: "Profile",
        user: "User",
        favoritesCount: "Favorite Games",
        timeSpent: "Time in App",
        shareWithFriends: "Share with Friends",
        feedback: "Leave Feedback",
        play: "Play",
        go: "Go",
        linkCopied: "Link copied!",
        addedToFavorites: "Added to favorites",
        removedFromFavorites: "Removed from favorites"
    }
};

// App State
let currentUser = null;
let allGames = [];
let allExchanges = [];
let userFavorites = [];
let currentCategory = 'all';
let currentLanguage = 'ru';
let startTime = Date.now();

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupTelegramWebApp();
    loadThemePreference();
    loadLanguagePreference();
    setupEventListeners();
    loadGames();
    loadExchanges();
    loadNotifications();
    loadUserData();
    trackUserActivity();
}

// Telegram Web App Integration
function setupTelegramWebApp() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        tg.ready();
        
        currentUser = tg.initDataUnsafe?.user || null;
        
        // Apply Telegram theme
        if (tg.themeParams) {
            applyTelegramTheme(tg.themeParams);
        }
        
        // Register user in Firebase
        if (currentUser) {
            registerUser(currentUser);
        }
    }
}

function applyTelegramTheme(themeParams) {
    if (themeParams.bg_color) {
        document.documentElement.style.setProperty('--tg-bg', themeParams.bg_color);
    }
    if (themeParams.text_color) {
        document.documentElement.style.setProperty('--tg-text', themeParams.text_color);
    }
}

// Firebase Functions
function registerUser(user) {
    if (!database) return;
    
    const userRef = database.ref('users/' + user.id);
    userRef.once('value', (snapshot) => {
        if (!snapshot.exists()) {
            userRef.set({
                id: user.id,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                username: user.username || '',
                language_code: user.language_code || 'ru',
                joined_at: Date.now(),
                last_active: Date.now()
            });
        } else {
            userRef.update({
                last_active: Date.now()
            });
        }
    });
    
    // Update stats
    updateStats();
}

function updateStats() {
    if (!database) return;
    
    const statsRef = database.ref('stats');
    statsRef.transaction((stats) => {
        if (!stats) {
            return {
                total_users: 1,
                active_users_today: 1,
                last_updated: Date.now()
            };
        }
        
        const today = new Date().toDateString();
        if (new Date(stats.last_updated).toDateString() !== today) {
            stats.active_users_today = 1;
        } else {
            stats.active_users_today = (stats.active_users_today || 0) + 1;
        }
        
        stats.last_updated = Date.now();
        return stats;
    });
}

function loadGames() {
    if (!database) {
        loadDefaultGames();
        return;
    }
    
    const gamesRef = database.ref('games');
    gamesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            allGames = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
            displayGames();
        } else {
            loadDefaultGames();
        }
    });
}

function loadDefaultGames() {
    allGames = [
        {
            id: 'hamster-gamedev',
            name: 'Hamster GameDev',
            description: 'Создай свою студию',
            bot: 'hamsterdev_bot',
            category: 'casual',
            rating: 4.8,
            isNew: false,
            icon: '🐹'
        },
        {
            id: 'hamster-king',
            name: 'Hamster King',
            description: 'Стань королем хомяков',
            bot: 'hamsterking_bot',
            category: 'action',
            rating: 4.9,
            isNew: false,
            icon: '👑'
        },
        {
            id: 'hamster-fightclub',
            name: 'Hamster Fight Club',
            description: 'Бойцовский клуб хомяков',
            bot: 'hamsterfightclub_bot',
            category: 'action',
            rating: 4.7,
            isNew: true,
            icon: '🥊'
        },
        {
            id: 'bitquest',
            name: 'BitQuest',
            description: 'Приключения в мире крипты',
            bot: 'bitquest_bot',
            category: 'casual',
            rating: 4.6,
            isNew: true,
            icon: '🪙'
        }
    ];
    
    // Save to Firebase
    if (database) {
        const gamesRef = database.ref('games');
        allGames.forEach(game => {
            gamesRef.child(game.id).set(game);
        });
    }
    
    displayGames();
}

function loadExchanges() {
    if (!database) {
        loadDefaultExchanges();
        return;
    }
    
    const exchangesRef = database.ref('exchanges');
    exchangesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            allExchanges = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
            displayExchanges();
        } else {
            loadDefaultExchanges();
        }
    });
}

function loadDefaultExchanges() {
    allExchanges = [
        {
            id: 'bybit',
            name: 'Bybit',
            description: 'Продвинутая торговая платформа',
            url: 'https://www.bybit.com',
            icon: '🔵'
        },
        {
            id: 'bingx',
            name: 'BingX',
            description: 'Социальная торговля и копирование',
            url: 'https://www.bingx.com',
            icon: '🟬'
        },
        {
            id: 'bitget',
            name: 'Bitget',
            description: 'Инновационная торговая платформа',
            url: 'https://www.bitget.com',
            icon: '🔶'
        },
        {
            id: 'mexc',
            name: 'MEXC',
            description: 'Глобальная биржа с низкими комиссиями',
            url: 'https://www.mexc.com',
            icon: '🟢'
        }
    ];
    
    // Save to Firebase
    if (database) {
        const exchangesRef = database.ref('exchanges');
        allExchanges.forEach(exchange => {
            exchangesRef.child(exchange.id).set(exchange);
        });
    }
    
    displayExchanges();
}

function loadNotifications() {
    if (!database) return;
    
    const notificationsRef = database.ref('notifications').orderByChild('timestamp').limitToLast(20);
    notificationsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const notifications = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })).reverse();
            displayNotifications(notifications);
        }
    });
}

function displayNotifications(notifications) {
    const notificationsList = document.getElementById('notifications-list');
    const notificationBadge = document.getElementById('notification-badge');
    
    if (notifications.length === 0) {
        notificationsList.innerHTML = `<div class="no-notifications" data-i18n="noNotifications">${translations[currentLanguage].noNotifications}</div>`;
        notificationBadge.style.display = 'none';
        return;
    }
    
    // Show unread count
    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = 'block';
    } else {
        notificationBadge.style.display = 'none';
    }
    
    notificationsList.innerHTML = notifications.map(notif => `
        <div class="notification-item ${!notif.read ? 'unread' : ''}">
            <div class="notification-title">${notif.title}</div>
            <div class="notification-text">${notif.message}</div>
            <div class="notification-time">${formatTime(notif.timestamp)}</div>
        </div>
    `).join('');
}

function displayGames() {
    const gamesGrid = document.getElementById('games-grid');
    const gamesCount = document.getElementById('games-count');
    
    let filteredGames = filterGames();
    
    gamesCount.textContent = `${filteredGames.length} ${currentLanguage === 'ru' ? 'игр' : 'games'}`;
    
    if (filteredGames.length === 0) {
        gamesGrid.innerHTML = `<div class="loading-spinner">${currentLanguage === 'ru' ? 'Игры не найдены' : 'No games found'}</div>`;
        return;
    }
    
    gamesGrid.innerHTML = filteredGames.map(game => `
        <div class="game-card" data-game-id="${game.id}">
            <div class="game-image">
                ${game.icon || '🎮'}
            </div>
            <div class="game-info">
                <h3>
                    ${game.name}
                    ${game.isNew ? '<span class="game-badge">NEW</span>' : ''}
                </h3>
                <div class="game-description">${game.description}</div>
                <div class="game-meta">
                    <div class="game-rating">
                        ⭐ ${game.rating || '4.5'}
                    </div>
                    <div class="game-category">
                        🏷️ ${getCategoryName(game.category)}
                    </div>
                </div>
            </div>
            <div class="game-actions">
                <button class="play-button" data-bot="${game.bot}" data-i18n="play">
                    ${translations[currentLanguage].play}
                </button>
                <button class="favorite-button ${isFavorite(game.id) ? 'active' : ''}" data-game-id="${game.id}">
                    ${isFavorite(game.id) ? '❤️' : '🤍'}
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.play-button').forEach(btn => {
        btn.addEventListener('click', handlePlayGame);
    });
    
    document.querySelectorAll('.favorite-button').forEach(btn => {
        btn.addEventListener('click', handleFavoriteToggle);
    });
}

function displayExchanges() {
    const exchangesList = document.getElementById('exchanges-list');
    
    if (allExchanges.length === 0) {
        exchangesList.innerHTML = `<div class="loading-spinner">${currentLanguage === 'ru' ? 'Загрузка бирж...' : 'Loading exchanges...'}</div>`;
        return;
    }
    
    exchangesList.innerHTML = allExchanges.map(exchange => `
        <div class="exchange-card">
            <div class="exchange-logo">
                ${exchange.icon || '📊'}
            </div>
            <div class="exchange-info">
                <h3>${exchange.name}</h3>
                <p>${exchange.description}</p>
            </div>
            <button class="exchange-button" data-url="${exchange.url}" data-i18n="go">
                ${translations[currentLanguage].go}
            </button>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.exchange-button').forEach(btn => {
        btn.addEventListener('click', handleOpenExchange);
    });
}

function filterGames() {
    let filtered = allGames;
    
    // Filter by category
    if (currentCategory === 'popular') {
        filtered = filtered.filter(g => (g.rating || 0) >= 4.7);
    } else if (currentCategory === 'new') {
        filtered = filtered.filter(g => g.isNew);
    } else if (currentCategory === 'favorites') {
        filtered = filtered.filter(g => isFavorite(g.id));
    } else if (currentCategory !== 'all') {
        filtered = filtered.filter(g => g.category === currentCategory);
    }
    
    // Filter by search
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    if (searchValue) {
        filtered = filtered.filter(g => 
            g.name.toLowerCase().includes(searchValue) ||
            g.description.toLowerCase().includes(searchValue)
        );
    }
    
    return filtered;
}

function getCategoryName(category) {
    const names = {
        'ru': {
            'action': 'Экшн',
            'casual': 'Казуал',
            'strategy': 'Стратегия',
            'puzzle': 'Головоломка'
        },
        'en': {
            'action': 'Action',
            'casual': 'Casual',
            'strategy': 'Strategy',
            'puzzle': 'Puzzle'
        }
    };
    return names[currentLanguage][category] || category;
}

function isFavorite(gameId) {
    return userFavorites.includes(gameId);
}

function loadUserData() {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        userFavorites = JSON.parse(savedFavorites);
    }
    
    updateUserProfile();
}

function updateUserProfile() {
    // Update user info
    if (currentUser) {
        const userName = document.getElementById('user-name');
        const userUsername = document.getElementById('user-username');
        const userAvatar = document.getElementById('user-avatar');
        const avatarImg = document.getElementById('avatar-img');
        const avatarFallback = document.getElementById('avatar-fallback');
        
        if (userName) {
            userName.textContent = currentUser.first_name + (currentUser.last_name ? ' ' + currentUser.last_name : '');
        }
        
        if (userUsername && currentUser.username) {
            userUsername.textContent = '@' + currentUser.username;
        }
        
        if (currentUser.photo_url) {
            avatarImg.src = currentUser.photo_url;
            avatarImg.style.display = 'block';
            avatarFallback.style.display = 'none';
        } else if (currentUser.first_name) {
            avatarFallback.textContent = currentUser.first_name.charAt(0).toUpperCase();
        }
    }
    
    // Update stats
    document.getElementById('favorites-count').textContent = userFavorites.length;
    
    // Calculate time spent
    const timeSpent = Math.floor((Date.now() - startTime) / 60000);
    document.getElementById('time-spent').textContent = `${timeSpent} ${currentLanguage === 'ru' ? 'мин' : 'min'}`;
}

function trackUserActivity() {
    setInterval(() => {
        const timeSpent = Math.floor((Date.now() - startTime) / 60000);
        document.getElementById('time-spent').textContent = `${timeSpent} ${currentLanguage === 'ru' ? 'мин' : 'min'}`;
    }, 60000); // Update every minute
}

// Event Handlers
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });
    
    // Settings
    document.getElementById('settings-button').addEventListener('click', () => {
        document.getElementById('settings-panel').classList.add('active');
        vibrate();
    });
    
    document.getElementById('close-settings').addEventListener('click', closeSettings);
    document.getElementById('close-settings-btn').addEventListener('click', closeSettings);
    document.getElementById('settings-panel').addEventListener('click', (e) => {
        if (e.target.id === 'settings-panel') closeSettings();
    });
    
    // Notifications
    document.getElementById('notifications-button').addEventListener('click', () => {
        document.getElementById('notifications-panel').classList.add('active');
        markNotificationsAsRead();
        vibrate();
    });
    
    document.getElementById('close-notifications').addEventListener('click', closeNotifications);
    document.getElementById('notifications-panel').addEventListener('click', (e) => {
        if (e.target.id === 'notifications-panel') closeNotifications();
    });
    
    // Theme switcher
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', handleThemeChange);
    });
    
    // Language switcher
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', handleLanguageChange);
    });
    
    // Categories
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', handleCategoryChange);
    });
    
    // Search
    document.getElementById('search-input').addEventListener('input', () => {
        displayGames();
    });
    
    // Profile actions
    document.getElementById('share-friends-button').addEventListener('click', handleShare);
    document.getElementById('feedback-button').addEventListener('click', handleFeedback);
}

function handleNavigation(e) {
    vibrate();
    const targetSection = this.getAttribute('data-section');
    
    // Update active nav
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    this.classList.add('active');
    
    // Show target section
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
        if (section.id === targetSection) {
            section.classList.add('active');
        }
    });
}

function handlePlayGame(e) {
    e.stopPropagation();
    vibrate();
    const botUsername = this.getAttribute('data-bot');
    const telegramUrl = `https://t.me/${botUsername}?start=app`;
    
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openTelegramLink(telegramUrl);
    } else {
        window.open(telegramUrl, '_blank');
    }
}

function handleOpenExchange(e) {
    e.stopPropagation();
    vibrate();
    const url = this.getAttribute('data-url');
    
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openLink(url);
    } else {
        window.open(url, '_blank');
    }
}

function handleFavoriteToggle(e) {
    e.stopPropagation();
    vibrate();
    const gameId = this.getAttribute('data-game-id');
    
    if (isFavorite(gameId)) {
        userFavorites = userFavorites.filter(id => id !== gameId);
        showToast(translations[currentLanguage].removedFromFavorites);
    } else {
        userFavorites.push(gameId);
        showToast(translations[currentLanguage].addedToFavorites);
    }
    
    localStorage.setItem('favorites', JSON.stringify(userFavorites));
    updateUserProfile();
    displayGames();
}

function handleCategoryChange(e) {
    vibrate();
    currentCategory = this.getAttribute('data-category');
    
    document.querySelectorAll('.category-chip').forEach(chip => chip.classList.remove('active'));
    this.classList.add('active');
    
    displayGames();
}

function handleThemeChange(e) {
    vibrate();
    const theme = this.getAttribute('data-theme');
    
    document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
    this.classList.add('active');
    
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    localStorage.setItem('theme', theme);
}

function handleLanguageChange(e) {
    vibrate();
    const lang = this.getAttribute('data-lang');
    
    document.querySelectorAll('.language-option').forEach(opt => opt.classList.remove('active'));
    this.classList.add('active');
    
    currentLanguage = lang;
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Refresh displays
    displayGames();
    displayExchanges();
    updateUserProfile();
}

function handleShare() {
    vibrate();
    const shareUrl = window.location.href;
    const shareText = currentLanguage === 'ru' 
        ? '🎮 Открой для себя лучшие Telegram игры в одном приложении!'
        : '🎮 Discover the best Telegram games in one app!';
    
    if (navigator.share) {
        navigator.share({
            title: 'Games Verse',
            text: shareText,
            url: shareUrl
        }).catch(() => {});
    } else {
        copyToClipboard(shareUrl);
        showToast(translations[currentLanguage].linkCopied);
    }
}

function handleFeedback() {
    vibrate();
    const feedbackUrl = `https://t.me/your_support_bot`;
    
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openTelegramLink(feedbackUrl);
    } else {
        window.open(feedbackUrl, '_blank');
    }
}

function closeSettings() {
    document.getElementById('settings-panel').classList.remove('active');
}

function closeNotifications() {
    document.getElementById('notifications-panel').classList.remove('active');
}

function markNotificationsAsRead() {
    if (!database || !currentUser) return;
    
    const notificationsRef = database.ref('notifications');
    notificationsRef.once('value', (snapshot) => {
        snapshot.forEach((child) => {
            child.ref.update({ read: true });
        });
    });
    
    document.getElementById('notification-badge').style.display = 'none';
}

// Utility Functions
function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    document.querySelectorAll('.theme-option').forEach(option => {
        if (option.getAttribute('data-theme') === savedTheme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

function loadLanguagePreference() {
    const savedLang = localStorage.getItem('language') || 'ru';
    currentLanguage = savedLang;
    setLanguage(savedLang);
    
    document.querySelectorAll('.language-option').forEach(option => {
        if (option.getAttribute('data-lang') === savedLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return currentLanguage === 'ru' ? 'только что' : 'just now';
    if (diffMins < 60) return `${diffMins} ${currentLanguage === 'ru' ? 'мин назад' : 'min ago'}`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ${currentLanguage === 'ru' ? 'ч назад' : 'h ago'}`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ${currentLanguage === 'ru' ? 'д назад' : 'd ago'}`;
}
