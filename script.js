// Конфигурация приложения
const APP_CONFIG = {
    version: '2.4.0',
    build: '2025.01.21',
    apiUrl: window.location.origin + '/api'
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
        setupNavigation();
        setupTelegramIntegration();
        setupThemeToggle();
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

// ==================== UI FUNCTIONS ====================

function displayGames(games) {
    const container = document.getElementById('games-container');
    
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
                            Играть
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
            const url = this.getAttribute('data-url');
            openGame(url);
        });
    });
    
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('click', function() {
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
    shareButton.addEventListener('click', shareApp);
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
