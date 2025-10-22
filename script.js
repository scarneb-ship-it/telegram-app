// Games Verse - Enhanced Version with Analytics
// localStorage keys
const STORAGE_KEYS = {
  GAMES: 'gamesverse_games',
  EXCHANGES: 'gamesverse_exchanges',
  ANALYTICS: 'gamesverse_analytics',
  FAVORITES: 'gamesverse_favorites',
  USER_STATS: 'gamesverse_user_stats',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Default data
const DEFAULT_GAMES = [
  {
    id: 'hamster-gamedev',
    name: 'Hamster GameDev',
    description: 'Создай свою студию',
    bot: 'hamsterdev_bot',
    image: 'images/hamster-gamedev.jpg',
    rating: 4.8,
    views: 1523,
    category: 'strategy'
  },
  {
    id: 'hamster-king',
    name: 'Hamster King',
    description: 'Стань королем хомяков',
    bot: 'hamsterking_bot',
    image: 'images/hamster-king.jpg',
    rating: 4.7,
    views: 1234,
    category: 'adventure'
  },
  {
    id: 'hamster-fightclub',
    name: 'Hamster Fight Club',
    description: 'Бойцовский клуб хомяков',
    bot: 'hamsterfightclub_bot',
    image: 'images/hamster-fightclub.jpg',
    rating: 4.6,
    views: 987,
    category: 'action'
  },
  {
    id: 'bitquest',
    name: 'BitQuest',
    description: 'Приключения в мире крипты',
    bot: 'bitquest_bot',
    image: 'images/bitquest.jpg',
    rating: 4.5,
    views: 856,
    category: 'adventure'
  }
];

const DEFAULT_EXCHANGES = [
  {
    id: 'bybit',
    name: 'Bybit',
    description: 'Продвинутая торговая платформа',
    url: 'https://www.bybit.com',
    image: 'images/bybit.jpg',
    views: 2341
  },
  {
    id: 'bingx',
    name: 'BingX',
    description: 'Социальная торговля и копирование',
    url: 'https://www.bingx.com',
    image: 'images/bingx.jpg',
    views: 1876
  },
  {
    id: 'bitget',
    name: 'Bitget',
    description: 'Инновационная торговая платформа',
    url: 'https://www.bitget.com',
    image: 'images/bitget.jpg',
    views: 1654
  },
  {
    id: 'mexc',
    name: 'MEXC',
    description: 'Глобальная биржа с низкими комиссиями',
    url: 'https://www.mexc.com',
    image: 'images/mexc.jpg',
    views: 1432
  }
];

// Translations
const translations = {
  ru: {
    appTitle: '🎮 Games Verse',
    settings: 'Настройки',
    theme: 'Тема',
    lightTheme: 'Светлая',
    darkTheme: 'Темная',
    language: 'Язык',
    russian: 'Русский',
    english: 'English',
    done: 'Готово',
    games: 'Игры',
    bestGames: 'Лучшие игры Telegram',
    play: 'Играть',
    exchanges: 'Биржи',
    exchangesDesc: 'Торгуйте криптовалютами безопасно',
    user: 'Пользователь',
    shareWithFriends: 'Поделиться с друзьями',
    profile: 'Профиль',
    linkCopied: 'Ссылка скопирована в буфер обмена!',
    go: 'Перейти',
    search: 'Поиск игр и бирж...',
    all: 'Все',
    favorites: '❤️ Избранное',
    popular: '🔥 Популярные',
    noResults: 'Ничего не найдено',
    gamesPlayed: 'Игр открыто',
    favoritesCount: 'В избранном'
  },
  en: {
    appTitle: '🎮 Games Verse',
    settings: 'Settings',
    theme: 'Theme',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    language: 'Language',
    russian: 'Russian',
    english: 'English',
    done: 'Done',
    games: 'Games',
    bestGames: 'Best Telegram Games',
    play: 'Play',
    exchanges: 'Exchanges',
    exchangesDesc: 'Trade cryptocurrencies safely',
    user: 'User',
    shareWithFriends: 'Share with friends',
    profile: 'Profile',
    linkCopied: 'Link copied to clipboard!',
    go: 'Go',
    search: 'Search games and exchanges...',
    all: 'All',
    favorites: '❤️ Favorites',
    popular: '🔥 Popular',
    noResults: 'No results found',
    gamesPlayed: 'Games played',
    favoritesCount: 'Favorites'
  }
};

// State
let currentFilter = 'all';
let currentLang = 'ru';
let games = [];
let exchanges = [];
let favorites = [];
let userStats = { gamesPlayed: 0, favorites: 0 };

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  initializeData();
  initializeApp();
});

function initializeData() {
  // Load or initialize games
  const storedGames = localStorage.getItem(STORAGE_KEYS.GAMES);
  if (storedGames) {
    games = JSON.parse(storedGames);
  } else {
    games = [...DEFAULT_GAMES];
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  }

  // Load or initialize exchanges
  const storedExchanges = localStorage.getItem(STORAGE_KEYS.EXCHANGES);
  if (storedExchanges) {
    exchanges = JSON.parse(storedExchanges);
  } else {
    exchanges = [...DEFAULT_EXCHANGES];
    localStorage.setItem(STORAGE_KEYS.EXCHANGES, JSON.stringify(exchanges));
  }

  // Load favorites
  const storedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  if (storedFavorites) {
    favorites = JSON.parse(storedFavorites);
  }

  // Load user stats
  const storedStats = localStorage.getItem(STORAGE_KEYS.USER_STATS);
  if (storedStats) {
    userStats = JSON.parse(storedStats);
  }
}

function vibrate() {
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

function initializeApp() {
  setupNavigation();
  setupSearch();
  setupFilters();
  setupSettingsPanel();
  loadThemePreference();
  loadLanguagePreference();
  loadUserData();
  setupShareButton();
  renderGames();
  renderExchanges();
  updateProfileStats();
  
  // Smooth loading
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
  
  // Telegram Web App integration
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.expand();
    
    const themeParams = window.Telegram.WebApp.themeParams;
    if (themeParams && themeParams.bg_color) {
      document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
    }
  }
}

// Navigation
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

// Search functionality
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase().trim();
    
    // Determine which section is active
    const activeSection = document.querySelector('.content-section.active');
    
    if (activeSection.id === 'games-section') {
      renderGames(query);
    } else if (activeSection.id === 'exchanges-section') {
      renderExchanges(query);
    }
  });
}

// Filter functionality
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      vibrate();
      
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      currentFilter = this.getAttribute('data-filter');
      renderGames();
    });
  });
}

// Render games
function renderGames(searchQuery = '') {
  const gamesGrid = document.getElementById('games-grid');
  const noResults = document.getElementById('no-games-results');
  
  let filteredGames = [...games];
  
  // Apply search filter
  if (searchQuery) {
    filteredGames = filteredGames.filter(game => 
      game.name.toLowerCase().includes(searchQuery) ||
      game.description.toLowerCase().includes(searchQuery)
    );
  }
  
  // Apply category filter
  if (currentFilter === 'favorites') {
    filteredGames = filteredGames.filter(game => favorites.includes(game.id));
  } else if (currentFilter === 'popular') {
    filteredGames = filteredGames.sort((a, b) => b.views - a.views).slice(0, 3);
  }
  
  gamesGrid.innerHTML = '';
  
  if (filteredGames.length === 0) {
    noResults.style.display = 'block';
    return;
  } else {
    noResults.style.display = 'none';
  }
  
  filteredGames.forEach(game => {
    const isFavorite = favorites.includes(game.id);
    const gameCard = document.createElement('div');
    gameCard.className = `game-card ${isFavorite ? 'favorite' : ''}`;
    gameCard.innerHTML = `
      <div class="game-image">
        <img src="${game.image}" alt="${game.name}" class="game-img" onerror="this.style.display='none'">
      </div>
      <div class="game-info">
        <h3>${game.name}</h3>
        <p data-i18n="${game.id}Desc">${game.description}</p>
        <div class="game-meta">
          <span class="rating">⭐ ${game.rating}</span>
          <span class="views">👁️ ${formatNumber(game.views)}</span>
        </div>
      </div>
      <div class="game-actions">
        <button class="favorite-btn" data-game-id="${game.id}">${isFavorite ? '❤️' : '🤍'}</button>
        <button class="play-button" data-bot="${game.bot}" data-game-id="${game.id}" data-i18n="play">${translations[currentLang].play}</button>
      </div>
    `;
    
    gamesGrid.appendChild(gameCard);
  });
  
  // Setup game buttons
  setupGameButtons();
  setupFavoriteButtons();
}

// Render exchanges
function renderExchanges(searchQuery = '') {
  const exchangesList = document.getElementById('exchanges-list');
  const noResults = document.getElementById('no-exchanges-results');
  
  let filteredExchanges = [...exchanges];
  
  if (searchQuery) {
    filteredExchanges = filteredExchanges.filter(exchange => 
      exchange.name.toLowerCase().includes(searchQuery) ||
      exchange.description.toLowerCase().includes(searchQuery)
    );
  }
  
  exchangesList.innerHTML = '';
  
  if (filteredExchanges.length === 0) {
    noResults.style.display = 'block';
    return;
  } else {
    noResults.style.display = 'none';
  }
  
  filteredExchanges.forEach(exchange => {
    const exchangeCard = document.createElement('div');
    exchangeCard.className = 'exchange-card';
    exchangeCard.innerHTML = `
      <div class="exchange-logo">
        <img src="${exchange.image}" alt="${exchange.name}" class="exchange-img" onerror="this.style.display='none'">
      </div>
      <div class="exchange-info">
        <h3>${exchange.name}</h3>
        <p data-i18n="${exchange.id}Desc">${exchange.description}</p>
        <div class="exchange-meta">👁️ ${formatNumber(exchange.views)} ${translations[currentLang].views || 'просмотров'}</div>
      </div>
      <button class="exchange-button" data-url="${exchange.url}" data-exchange-id="${exchange.id}" data-i18n="go">${translations[currentLang].go}</button>
    `;
    
    exchangesList.appendChild(exchangeCard);
  });
  
  setupExchangeButtons();
}

// Setup game buttons
function setupGameButtons() {
  const playButtons = document.querySelectorAll('.play-button');
  
  playButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      vibrate();
      
      const botUsername = this.getAttribute('data-bot');
      const gameId = this.getAttribute('data-game-id');
      
      // Track analytics
      trackGameClick(gameId);
      
      // Update user stats
      userStats.gamesPlayed++;
      localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(userStats));
      updateProfileStats();
      
      if (botUsername) {
        const telegramUrl = `https://t.me/${botUsername}?start=app`;
        
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.openTelegramLink(telegramUrl);
        } else {
          window.open(telegramUrl, '_blank');
        }
      }
    });
  });
}

// Setup favorite buttons
function setupFavoriteButtons() {
  const favBtns = document.querySelectorAll('.favorite-btn');
  
  favBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      vibrate();
      
      const gameId = this.getAttribute('data-game-id');
      const isFavorite = favorites.includes(gameId);
      
      if (isFavorite) {
        favorites = favorites.filter(id => id !== gameId);
        this.textContent = '🤍';
      } else {
        favorites.push(gameId);
        this.textContent = '❤️';
      }
      
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      userStats.favorites = favorites.length;
      localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(userStats));
      updateProfileStats();
      
      // Update card styling
      const card = this.closest('.game-card');
      if (favorites.includes(gameId)) {
        card.classList.add('favorite');
      } else {
        card.classList.remove('favorite');
      }
    });
  });
}

// Setup exchange buttons
function setupExchangeButtons() {
  const exchangeButtons = document.querySelectorAll('.exchange-button');
  
  exchangeButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      vibrate();
      
      const exchangeUrl = this.getAttribute('data-url');
      const exchangeId = this.getAttribute('data-exchange-id');
      
      // Track analytics
      trackExchangeClick(exchangeId);
      
      if (exchangeUrl) {
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.openLink(exchangeUrl);
        } else {
          window.open(exchangeUrl, '_blank');
        }
      }
    });
  });
}

// Analytics tracking
function trackGameClick(gameId) {
  const analytics = getAnalytics();
  const today = new Date().toISOString().split('T')[0];
  
  if (!analytics.games[gameId]) {
    analytics.games[gameId] = { clicks: 0, lastClick: null };
  }
  
  analytics.games[gameId].clicks++;
  analytics.games[gameId].lastClick = today;
  
  if (!analytics.dailyStats[today]) {
    analytics.dailyStats[today] = { gameClicks: 0, exchangeClicks: 0 };
  }
  analytics.dailyStats[today].gameClicks++;
  
  saveAnalytics(analytics);
  
  // Update game views
  const game = games.find(g => g.id === gameId);
  if (game) {
    game.views++;
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  }
}

function trackExchangeClick(exchangeId) {
  const analytics = getAnalytics();
  const today = new Date().toISOString().split('T')[0];
  
  if (!analytics.exchanges[exchangeId]) {
    analytics.exchanges[exchangeId] = { clicks: 0, lastClick: null };
  }
  
  analytics.exchanges[exchangeId].clicks++;
  analytics.exchanges[exchangeId].lastClick = today;
  
  if (!analytics.dailyStats[today]) {
    analytics.dailyStats[today] = { gameClicks: 0, exchangeClicks: 0 };
  }
  analytics.dailyStats[today].exchangeClicks++;
  
  saveAnalytics(analytics);
  
  // Update exchange views
  const exchange = exchanges.find(e => e.id === exchangeId);
  if (exchange) {
    exchange.views++;
    localStorage.setItem(STORAGE_KEYS.EXCHANGES, JSON.stringify(exchanges));
  }
}

function getAnalytics() {
  const stored = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    games: {},
    exchanges: {},
    dailyStats: {},
    totalUsers: 1
  };
}

function saveAnalytics(analytics) {
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
}

// Settings panel
function setupSettingsPanel() {
  const settingsButton = document.getElementById('settings-button');
  const settingsPanel = document.getElementById('settings-panel');
  const closeSettings = document.getElementById('close-settings');
  
  if (settingsButton) {
    settingsButton.addEventListener('click', function() {
      vibrate();
      settingsPanel.classList.add('active');
    });
  }
  
  if (closeSettings) {
    closeSettings.addEventListener('click', function() {
      vibrate();
      settingsPanel.classList.remove('active');
    });
  }
  
  if (settingsPanel) {
    settingsPanel.addEventListener('click', function(e) {
      if (e.target === settingsPanel) {
        settingsPanel.classList.remove('active');
      }
    });
  }
  
  // Theme switcher
  const themeOptions = document.querySelectorAll('.theme-option');
  themeOptions.forEach(option => {
    option.addEventListener('click', function() {
      vibrate();
      const theme = this.getAttribute('data-theme');
      
      themeOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      if (theme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
      
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    });
  });
  
  // Language switcher
  const languageOptions = document.querySelectorAll('.language-option');
  languageOptions.forEach(option => {
    option.addEventListener('click', function() {
      vibrate();
      const lang = this.getAttribute('data-lang');
      
      languageOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      currentLang = lang;
      setLanguage(lang);
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
      
      // Re-render content with new language
      renderGames();
      renderExchanges();
    });
  });
}

function setLanguage(lang) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });
  
  // Update placeholder
  const searchInput = document.getElementById('search-input');
  if (searchInput && translations[lang].search) {
    searchInput.placeholder = translations[lang].search;
  }
}

function loadThemePreference() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
  updateSettingsThemeOptions(savedTheme);
}

function loadLanguagePreference() {
  const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'ru';
  currentLang = savedLang;
  setLanguage(savedLang);
  updateSettingsLanguageOptions(savedLang);
}

function updateSettingsThemeOptions(theme) {
  const themeOptions = document.querySelectorAll('.theme-option');
  themeOptions.forEach(option => {
    option.classList.remove('active');
    if (option.getAttribute('data-theme') === theme) {
      option.classList.add('active');
    }
  });
}

function updateSettingsLanguageOptions(lang) {
  const languageOptions = document.querySelectorAll('.language-option');
  languageOptions.forEach(option => {
    option.classList.remove('active');
    if (option.getAttribute('data-lang') === lang) {
      option.classList.add('active');
    }
  });
}

function loadUserData() {
  if (window.Telegram && window.Telegram.WebApp) {
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    
    if (user) {
      const userName = document.getElementById('user-name');
      if (userName && user.first_name) {
        userName.textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
      }
      
      const userUsername = document.getElementById('user-username');
      if (userUsername && user.username) {
        userUsername.textContent = '@' + user.username;
      }
      
      const avatarImg = document.getElementById('avatar-img');
      const avatarFallback = document.getElementById('avatar-fallback');
      
      if (user.photo_url) {
        avatarImg.src = user.photo_url;
        avatarImg.style.display = 'block';
        avatarFallback.style.display = 'none';
      } else if (user.first_name) {
        avatarFallback.textContent = user.first_name.charAt(0).toUpperCase();
      }
    }
  }
}

function updateProfileStats() {
  document.getElementById('games-played').textContent = userStats.gamesPlayed || 0;
  document.getElementById('favorites-count').textContent = favorites.length || 0;
}

function setupShareButton() {
  const shareButton = document.getElementById('share-friends-button');
  const notification = document.getElementById('notification');
  
  if (shareButton) {
    shareButton.addEventListener('click', function() {
      vibrate();
      const shareUrl = window.location.href;
      const shareText = 'Открой для себя лучшие игры Telegram в одном приложении! 🎮';
      
      if (navigator.share) {
        navigator.share({
          title: 'Games Verse',
          text: shareText,
          url: shareUrl,
        }).catch(() => {});
      } else {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareUrl).then(() => {
            showNotification(notification);
          }).catch(() => {
            fallbackCopyToClipboard(shareUrl, notification);
          });
        } else {
          fallbackCopyToClipboard(shareUrl, notification);
        }
      }
    });
  }
}

function fallbackCopyToClipboard(text, notification) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotification(notification);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

function showNotification(notification, customMessage) {
  if (customMessage) {
    notification.textContent = customMessage;
  }
  
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num;
}
