// Конфигурация приложения
const APP_CONFIG = {
    version: '2.4.0',
    build: '2025.01.21',
    apiUrl: window.location.origin + '/api'
};

// Настройки по умолчанию
const DEFAULT_SETTINGS = {
    vibration: true,
    language: 'ru'
};

// Переводы
const TRANSLATIONS = {
    ru: {
        appTitle: "Хамстер",
        appSubtitle: "Все игры Хамстер Комбат",
        games: "Игры",
        gamesSubtitle: "Выберите игру и начните играть",
        exchanges: "Биржи",
        exchangesSubtitle: "Топовые криптобиржи",
        news: "Новости",
        newsSubtitle: "Последние обновления платформы",
        profile: "Профиль",
        theme: "Сменить тему",
        language: "Язык",
        vibration: "Вибрация",
        vibrationOn: "Вибрация: Вкл",
        vibrationOff: "Вибрация: Выкл",
        share: "Поделиться",
        play: "Играть",
        players: "игроков",
        rating: "рейтинг"
    },
    en: {
        appTitle: "Hamster",
        appSubtitle: "All Hamster Combat Games",
        games: "Games",
        gamesSubtitle: "Choose a game and start playing",
        exchanges: "Exchanges",
        exchangesSubtitle: "Top crypto exchanges",
        news: "News",
        newsSubtitle: "Latest platform updates",
        profile: "Profile",
        theme: "Change theme",
        language: "Language",
        vibration: "Vibration",
        vibrationOn: "Vibration: On",
        vibrationOff: "Vibration: Off",
        share: "Share",
        play: "Play",
        players: "players",
        rating: "rating"
    }
};

// Данные игр
const GAMES_DATA = [
    {
        id: "1",
        name: "Hamster Gamedev",
        description: "Создай игровую студию и стань лидером индустрии",
        players: "15.2K",
        rating: "4.6",
        url: "https://t.me/hamster_gamedev_bot/start",
        image: "https://via.placeholder.com/80x80/667eea/ffffff?text=HG"
    },
    {
        id: "2", 
        name: "Hamster King",
        description: "Стань королём в эпических битвах за монеты",
        players: "8.7K",
        rating: "4.7",
        url: "https://t.me/hamster_king_bot/start",
        image: "https://via.placeholder.com/80x80/764ba2/ffffff?text=HK"
    },
    {
        id: "3",
        name: "Hamster Fight Club", 
        description: "Бойцовский клуб для самых сильных хомяков",
        players: "5.3K",
        rating: "4.9",
        url: "https://t.me/hamster_fight_club_bot/start",
        image: "https://via.placeholder.com/80x80/667eea/ffffff?text=HFC"
    },
    {
        id: "4",
        name: "Bitquest",
        description: "Крипто-приключение в фэнтези мире блокчейна",
        players: "12.1K",
        rating: "4.8",
        url: "https://t.me/bitquest_bot/start",
        image: "https://via.placeholder.com/80x80/764ba2/ffffff?text=BQ"
    }
];

// Данные бирж
const EXCHANGES_DATA = [
    {
        id: "1",
        name: "Binance",
        description: "Крупнейшая мировая криптобиржа",
        url: "https://www.binance.com",
        logo: "https://via.placeholder.com/50x50/F3BA2F/000000?text=B",
        features: ["Spot", "Futures", "Earn"]
    },
    {
        id: "2",
        name: "Bybit",
        description: "Лучшие условия для трейдинга",
        url: "https://www.bybit.com",
        logo: "https://via.placeholder.com/50x50/F7A600/000000?text=BY",
        features: ["Futures", "Copy Trading", "Options"]
    },
    {
        id: "3",
        name: "OKX",
        description: "Тысячи торговых пар",
        url: "https://www.okx.com",
        logo: "https://via.placeholder.com/50x50/000000/ffffff?text=OK",
        features: ["Spot", "DeFi", "NFT"]
    }
];

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('🚀 Хамстер v' + APP_CONFIG.version + ' initializing...');
    
    try {
        loadSettings();
        setupNavigation();
        setupTelegramIntegration();
        setupThemeToggle();
        setupLanguageToggle();
        setupVibrationToggle();
        setupShareButton();
        
        // Загрузка данных
        displayGames(GAMES_DATA);
        displayExchanges(EXCHANGES_DATA);
        loadNews();
        
        document.getElementById('app-version').textContent = APP_CONFIG.version;
        document.getElementById('app-build').textContent = APP_CONFIG.build;
        
        console.log('✅ Хамстер initialized successfully');
        
    } catch (error) {
        console.error('❌ App initialization failed:', error);
    }
}

// ==================== SETTINGS MANAGEMENT ====================

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('appSettings')) || DEFAULT_SETTINGS;
    window.appSettings = settings;
    applySettings();
}

function saveSettings() {
    localStorage.setItem('appSettings', JSON.stringify(window.appSettings));
    applySettings();
}

function applySettings() {
    // Применяем язык
    updateLanguage();
    
    // Применяем настройки вибрации
    updateVibrationButton();
}

// ==================== LANGUAGE MANAGEMENT ====================

function setupLanguageToggle() {
    const languageToggle = document.getElementById('language-toggle');
    languageToggle.addEventListener('click', function() {
        vibrate();
        toggleLanguage();
    });
}

function toggleLanguage() {
    const currentLang = window.appSettings.language;
    const newLang = currentLang === 'ru' ? 'en' : 'ru';
    
    window.appSettings.language = newLang;
    saveSettings();
    updateLanguage();
}

function updateLanguage() {
    const lang = window.appSettings.language;
    const t = TRANSLATIONS[lang];
    
    // Обновляем статические тексты
    document.querySelector('[data-translate="appTitle"]').textContent = t.appTitle;
    document.querySelector('[data-translate="appSubtitle"]').textContent = t.appSubtitle;
    document.querySelector('[data-translate="games"]').textContent = t.games;
    document.querySelector('[data-translate="gamesSubtitle"]').textContent = t.gamesSubtitle;
    document.querySelector('[data-translate="exchanges"]').textContent = t.exchanges;
    document.querySelector('[data-translate="exchangesSubtitle"]').textContent = t.exchangesSubtitle;
    document.querySelector('[data-translate="news"]').textContent = t.news;
    document.querySelector('[data-translate="newsSubtitle"]').textContent = t.newsSubtitle;
    document.querySelector('[data-translate="profile"]').textContent = t.profile;
    document.querySelector('[data-translate="theme"]').textContent = t.theme;
    document.querySelector('[data-translate="language"]').textContent = t.language;
    document.querySelector('[data-translate="share"]').textContent = t.share;
    
    // Обновляем язык кнопки
    const languageBtn = document.querySelector('#language-toggle .action-text');
    languageBtn.textContent = lang === 'ru' ? 'Русский' : 'English';
    
    // Обновляем кнопки в играх
    document.querySelectorAll('.play-button').forEach(btn => {
        btn.textContent = t.play;
    });
}

// ==================== VIBRATION MANAGEMENT ====================

function setupVibrationToggle() {
    const vibrationToggle = document.getElementById('vibration-toggle');
    vibrationToggle.addEventListener('click', function() {
        // Не добавляем вибрацию здесь, чтобы избежать рекурсии
        toggleVibration();
    });
}

function toggleVibration() {
    window.appSettings.vibration = !window.appSettings.vibration;
    saveSettings();
    updateVibrationButton();
    
    // Вибрация при переключении (если включена)
    if (window.appSettings.vibration) {
        vibrate();
    }
}

function updateVibrationButton() {
    const vibrationBtn = document.querySelector('#vibration-toggle .action-text');
    const lang = window.appSettings.language;
    
    if (window.appSettings.vibration) {
        vibrationBtn.textContent = lang === 'ru' ? 'Вибрация: Вкл' : 'Vibration: On';
    } else {
        vibrationBtn.textContent = lang === 'ru' ? 'Вибрация: Выкл' : 'Vibration: Off';
    }
}

function vibrate() {
    if (!window.appSettings.vibration) return;
    
    // Визуальная вибрация для всех устройств
    const elements = document.querySelectorAll('.nav-item.active, .play-button, .profile-action-btn');
    elements.forEach(element => {
        element.classList.add('vibrate');
        setTimeout(() => {
            element.classList.remove('vibrate');
        }, 100);
    });
    
    // Нативная вибрация для поддерживающих устройств
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

// ==================== UI FUNCTIONS ====================

function displayGames(games) {
    const container = document.getElementById('games-container');
    const t = TRANSLATIONS[window.appSettings.language];
    
    if (!games || games.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎮</div>
                <h3>Игры временно недоступны</h3>
                <p>Попробуйте обновить страницу позже</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = games.map(game => `
        <div class="game-card" data-game-id="${game.id}">
            <div class="game-content">
                <div class="game-image">
                    <img src="${game.image}" alt="${game.name}" onerror="handleImageError(this)">
                </div>
                <div class="game-info">
                    <h3 class="game-title">${game.name}</h3>
                    <p class="game-description">${game.description}</p>
                    <div class="game-footer">
                        <div class="game-stats">
                            <div class="game-players">
                                <span>👥 ${game.players}</span>
                            </div>
                            <div class="game-rating">
                                <span>⭐ ${game.rating}</span>
                            </div>
                        </div>
                        <button class="play-button" data-url="${game.url}">
                            ${t.play}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    setupGameButtons();
}

function handleImageError(img) {
    console.warn('Image failed to load:', img.src);
    img.style.display = 'none';
    const parent = img.parentElement;
    parent.style.background = 'var(--accent-gradient)';
    parent.innerHTML = '<div class="image-fallback">🎮</div>';
}

function displayExchanges(exchanges) {
    const container = document.getElementById('exchanges-container');
    
    if (!exchanges || exchanges.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Биржи временно недоступны</p></div>';
        return;
    }
    
    container.innerHTML = exchanges.map(exchange => `
        <a href="${exchange.url}" class="exchange-card" target="_blank" rel="noopener">
            <div class="exchange-content">
                <div class="exchange-logo">
                    <img src="${exchange.logo}" alt="${exchange.name}" onerror="handleImageError(this)">
                </div>
                <div class="exchange-info">
                    <h3 class="exchange-name">${exchange.name}</h3>
                    <p class="exchange-description">${exchange.description}</p>
                    <div class="exchange-features">
                        ${exchange.features.map(feature => `
                            <span class="exchange-feature">${feature}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        </a>
    `).join('');
}

function loadNews() {
    fetch(APP_CONFIG.apiUrl + '/news')
        .then(response => response.json())
        .then(news => displayNews(news))
        .catch(error => {
            console.error('Failed to load news:', error);
            displayNews([{
                id: "1", 
                title: "Хамстер запущен!",
                content: "Новая игровая платформа с лучшими играми Telegram теперь доступна для всех!",
                date: new Date().toISOString()
            }]);
        });
}

function displayNews(news) {
    const container = document.getElementById('news-container');
    
    if (!news || news.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Новости временно недоступны</p></div>';
        return;
    }
    
    container.innerHTML = news.map(item => `
        <div class="news-item">
            <span class="news-date">${formatDate(item.date)}</span>
            <div class="news-title">${item.title}</div>
            <div class="news-content">${item.content}</div>
        </div>
    `).join('');
}

function setupGameButtons() {
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            vibrate();
            const url = this.getAttribute('data-url');
            openGame(url);
        });
    });
    
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('click', function() {
            vibrate();
            const playButton = this.querySelector('.play-button');
            const url = playButton.getAttribute('data-url');
            openGame(url);
        });
    });
}

function openGame(url) {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openLink(url);
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

// ==================== NAVIGATION ====================

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
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// ==================== TELEGRAM INTEGRATION ====================

function setupTelegramIntegration() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        tg.expand();
        tg.enableClosingConfirmation();
        
        const user = tg.initDataUnsafe.user;
        if (user) {
            updateUserProfile(user);
            registerUser(user);
        }
        
        tg.ready();
    } else {
        console.log('Telegram WebApp not detected, running in browser mode');
        updateUserProfile({
            first_name: 'Пользователь',
            username: 'user'
        });
    }
}

function updateUserProfile(user) {
    if (user) {
        const name = user.first_name || 'Пользователь';
        const username = user.username ? `@${user.username}` : 'Пользователь';
        
        document.getElementById('tg-name').textContent = name;
        document.getElementById('tg-username').textContent = username;
        
        if (user.photo_url) {
            document.getElementById('tg-avatar').innerHTML = `<img src="${user.photo_url}" alt="${name}">`;
            document.getElementById('tg-avatar-large').innerHTML = `<img src="${user.photo_url}" alt="${name}">`;
        }
    }
}

function registerUser(user) {
    fetch(APP_CONFIG.apiUrl + '/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: user.id,
            username: user.username || '',
            first_name: user.first_name || '',
            last_name: user.last_name || ''
        })
    })
    .then(response => response.json())
    .then(data => console.log('User registered:', data))
    .catch(error => console.error('Failed to register user:', error));
}

// ==================== THEME ====================

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.action-icon');
    const themeText = themeToggle.querySelector('.action-text');
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        vibrate();
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    });
    
    function updateThemeButton(theme) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Светлая тема';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Темная тема';
        }
    }
}

// ==================== SHARE ====================

function setupShareButton() {
    const shareButton = document.getElementById('share-button');
    shareButton.addEventListener('click', function() {
        vibrate();
        shareApp();
    });
}

function shareApp() {
    const shareText = "🎮 Открой для себя Хамстер - все лучшие игры Telegram в одном приложении!";
    const shareUrl = window.location.href;
    
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
    } else if (navigator.share) {
        navigator.share({
            title: 'Хамстер',
            text: shareText,
            url: shareUrl
        }).catch(err => console.log('Share failed:', err));
    } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Ссылка скопирована в буфер!');
        }).catch(err => console.error('Failed to copy:', err));
    }
}

// ==================== UTILS ====================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Глобальные функции
window.handleImageError = handleImageError;
