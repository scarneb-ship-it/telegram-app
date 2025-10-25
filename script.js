// Конфигурация приложения
const APP_CONFIG = {
    version: '2.5.0',
    build: '2024.02.15'
};

// Данные игр с правильными изображениями
const GAMES_DATA = [
    {
        id: "1",
        name: "Hamster Gamedev",
        description: "Создай игровую студию и стань лидером индустрии",
        players: "15.2K",
        rating: "4.6",
        url: "https://t.me/hamster_gamedev_bot/start",
        image: "images/hunterer-gamesdev.jpg",
        category: "popular"
    },
    {
        id: "2", 
        name: "Hamster King",
        description: "Стань королём в эпических битвах за монеты",
        players: "8.7K",
        rating: "4.7",
        url: "https://t.me/hamster_king_bot/start",
        image: "images/hamster_king.jpg",
        category: "popular"
    },
    {
        id: "3",
        name: "Hamster Fight Club", 
        description: "Бойцовский клуб для самых сильных хомяков",
        players: "5.3K",
        rating: "4.9",
        url: "https://t.me/hamster_fight_club_bot/start",
        image: "images/hunterer-fight-club.jpg",
        category: "new"
    },
    {
        id: "4",
        name: "Bitquest",
        description: "Крипто-приключение в фэнтези мире блокчейна",
        players: "12.1K",
        rating: "4.8",
        url: "https://t.me/bitquest_bot/start",
        image: "images/bitquest.jpg",
        category: "popular"
    },
    {
        id: "5",
        name: "Crypto Hamsters",
        description: "Собирай и развивай своих крипто-хомяков",
        players: "3.2K",
        rating: "4.5",
        url: "https://t.me/crypto_hamsters_bot/start",
        image: "images/crypto-hamsters.jpg",
        category: "new"
    },
    {
        id: "6",
        name: "Hamster Racing",
        description: "Гонки на хомяках с элементами стратегии",
        players: "7.1K",
        rating: "4.3",
        url: "https://t.me/hamster_racing_bot/start",
        image: "images/hamster-racing.jpg",
        category: "popular"
    }
];

// Данные бирж с правильными изображениями
const EXCHANGES_DATA = [
    {
        id: "1",
        name: "Binance",
        description: "Крупнейшая мировая криптобиржа",
        url: "https://www.binance.com",
        logo: "images/binarace.png",
        features: ["Spot", "Futures", "Earn"]
    },
    {
        id: "2",
        name: "Bybit",
        description: "Лучшие условия для трейдинга",
        url: "https://www.bybit.com",
        logo: "images/bybel.jpg",
        features: ["Futures", "Copy Trading", "Options"]
    },
    {
        id: "3",
        name: "OKX",
        description: "Тысячи торговых пар",
        url: "https://www.okx.com",
        logo: "images/okx.png",
        features: ["Spot", "DeFi", "NFT"]
    },
    {
        id: "4",
        name: "KuCoin",
        description: "Низкие комиссии и большой выбор",
        url: "https://www.kucoin.com",
        logo: "images/kucoin.png",
        features: ["Spot", "Margin", "Staking"]
    }
];

// Данные новостей
const NEWS_DATA = [
    {
        id: "1", 
        title: "Hamster Verse запущен!",
        content: "Новая игровая платформа с лучшими играми Telegram теперь доступна для всех! Открывайте, играйте и делитесь с друзьями.",
        date: new Date().toISOString()
    },
    {
        id: "2",
        title: "Добавлены новые игры",
        content: "В каталог добавлены популярные игры: Hamster Gamedev, Hamster King, Hamster Fight Club и многие другие. Обновляйте приложение!",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "3",
        title: "Система рекомендаций",
        content: "Теперь приложение предлагает персонализированные рекомендации игр на основе ваших предпочтений и истории.",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
];

// Состояние приложения
let appState = {
    currentFilter: 'all',
    searchQuery: '',
    userStats: {
        gamesPlayed: 0,
        daysInApp: 0
    }
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('🚀 Hamster Verse v' + APP_CONFIG.version + ' initializing...');
    
    try {
        setupNavigation();
        setupTelegramIntegration();
        setupThemeToggle();
        setupShareButton();
        setupSearch();
        setupFilters();
        setupAboutSection();
        
        // Загрузка данных
        displayGames(GAMES_DATA);
        displayExchanges(EXCHANGES_DATA);
        displayNews(NEWS_DATA);
        
        // Загрузка статистики пользователя
        loadUserStats();
        
        document.getElementById('app-version').textContent = APP_CONFIG.version;
        document.getElementById('app-build').textContent = APP_CONFIG.build;
        
        console.log('✅ Hamster Verse initialized successfully');
        
    } catch (error) {
        console.error('❌ App initialization failed:', error);
        showError('Не удалось загрузить приложение. Пожалуйста, перезагрузите страницу.');
    }
}

// ==================== UI FUNCTIONS ====================

function displayGames(games) {
    const container = document.getElementById('games-container');
    
    if (!games || games.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎮</div>
                <h3>Игры не найдены</h3>
                <p>Попробуйте изменить поисковый запрос или фильтр</p>
            </div>
        `;
        return;
    }
    
    // Фильтрация и поиск
    let filteredGames = games;
    
    if (appState.currentFilter !== 'all') {
        filteredGames = filteredGames.filter(game => game.category === appState.currentFilter);
    }
    
    if (appState.searchQuery) {
        const query = appState.searchQuery.toLowerCase();
        filteredGames = filteredGames.filter(game => 
            game.name.toLowerCase().includes(query) || 
            game.description.toLowerCase().includes(query)
        );
    }
    
    if (filteredGames.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>Игры не найдены</h3>
                <p>Попробуйте изменить поисковый запрос или фильтр</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredGames.map(game => `
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
    // Обновляем статистику
    updateUserStats('gamesPlayed');
    
    // Показываем индикатор загрузки
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.openLink(url);
        } else {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }, 1000);
}

// ==================== SEARCH AND FILTER FUNCTIONS ====================

function setupSearch() {
    const searchToggle = document.getElementById('search-toggle');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    
    searchToggle.addEventListener('click', function() {
        searchContainer.classList.toggle('hidden');
        if (!searchContainer.classList.contains('hidden')) {
            searchInput.focus();
        }
    });
    
    searchInput.addEventListener('input', function() {
        appState.searchQuery = this.value;
        searchClear.style.visibility = this.value ? 'visible' : 'hidden';
        displayGames(GAMES_DATA);
    });
    
    searchClear.addEventListener('click', function() {
        searchInput.value = '';
        appState.searchQuery = '';
        this.style.visibility = 'hidden';
        displayGames(GAMES_DATA);
    });
    
    // Закрытие поиска при клике вне области
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target) && !searchToggle.contains(e.target)) {
            searchContainer.classList.add('hidden');
        }
    });
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Обновляем состояние фильтра
            appState.currentFilter = this.getAttribute('data-filter');
            
            // Обновляем отображение игр
            displayGames(GAMES_DATA);
        });
    });
}

// ==================== USER STATISTICS ====================

function loadUserStats() {
    const savedStats = localStorage.getItem('hamsterUserStats');
    if (savedStats) {
        appState.userStats = JSON.parse(savedStats);
    } else {
        // Устанавливаем дату первого использования
        localStorage.setItem('hamsterFirstUse', new Date().toISOString());
    }
    updateStatsDisplay();
}

function updateUserStats(statType) {
    if (statType === 'gamesPlayed') {
        appState.userStats.gamesPlayed++;
    }
    
    // Обновляем дни в приложении
    const firstUse = localStorage.getItem('hamsterFirstUse');
    if (firstUse) {
        const firstUseDate = new Date(firstUse);
        const today = new Date();
        const diffTime = Math.abs(today - firstUseDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        appState.userStats.daysInApp = diffDays;
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('hamsterUserStats', JSON.stringify(appState.userStats));
    
    // Обновляем отображение
    updateStatsDisplay();
}

function updateStatsDisplay() {
    document.querySelector('.stat:nth-child(1) .stat-value').textContent = appState.userStats.gamesPlayed;
    document.querySelector('.stat:nth-child(2) .stat-value').textContent = appState.userStats.daysInApp;
}

// ==================== OTHER FUNCTIONS ====================

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

function setupTelegramIntegration() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        tg.expand();
        tg.enableClosingConfirmation();
        
        updateUserProfile(tg.initDataUnsafe.user);
        
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

function setupShareButton() {
    const shareButton = document.getElementById('share-button');
    shareButton.addEventListener('click', shareApp);
}

function setupAboutSection() {
    const aboutButton = document.getElementById('about-button');
    const aboutBack = document.getElementById('about-back');
    const profileSection = document.getElementById('profile-section');
    const aboutSection = document.getElementById('about-section');
    
    aboutButton.addEventListener('click', function() {
        profileSection.classList.remove('active');
        aboutSection.classList.add('active');
    });
    
    aboutBack.addEventListener('click', function() {
        aboutSection.classList.remove('active');
        profileSection.classList.add('active');
    });
}

function shareApp() {
    const shareText = "🎮 Открой для себя Hamster Verse - все лучшие игры Telegram в одном приложении!";
    const shareUrl = window.location.href;
    
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.shareUrl(shareUrl, shareText);
    } else if (navigator.share) {
        navigator.share({
            title: 'Hamster Verse',
            text: shareText,
            url: shareUrl
        });
    } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
            showNotification('Ссылка скопирована в буфер обмена!');
        });
    }
}

function showLoading() {
    document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent-gradient);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        z-index: 10000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function showError(message) {
    showNotification('❌ ' + message);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('ru-RU', options);
}

// Глобальные функции
window.handleImageError = handleImageError;

// Добавляем стили для анимации уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);
