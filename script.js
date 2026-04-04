// ==================== КОНФИГУРАЦИЯ ====================
// Легко меняйте игры и биржи здесь!

const GAMES_DATA = [
    {
        id: "pixelworld",   // уникальный ID для выделения стилем
        name: "Pixel World",
        link: "https://t.me/pixelworld/play?startapp=r6823288584",  // прямая реферальная ссылка
        description: "Строй свой мир в Pixel World Beta",
        rating: 4.9,
        players: "1.2M",
        image: "images/pixelworld.jpg",
        fallback: "🌍",
        isBeta: true          // маркер для бейджа BETA
    },
    {
        id: 1,
        name: "Hamster GameDev",
        bot: "https://t.me/Hamster_GAme_Dev_bot/start?startapp=kentId6823288584",
        description: "Создай свою студию",
        rating: 4.7,
        players: "901K",
        image: "images/hamster-gamedev.jpg",
        fallback: "🎮"
    },
    {
        id: 2,
        name: "Hamster King",
        bot: "https://t.me/hamsterking_game_bot?startapp=6823288584",
        description: "Стань королем хомяков",
        rating: 4.2,
        players: "581K",
        image: "images/hamster-king.jpg",
        fallback: "👑"
    },
    {
        id: 3,
        name: "Hamster Fight Club",
        bot: "https://t.me/hamster_fightclub_bot?startapp=NWE1YjA2YWUtZTAyMS01ZjA1LTg4ZTYtMGZmZjUwNDQwNjU5",
        description: "Бойцовский клуб хомяков",
        rating: 4.9,
        players: "386K",
        image: "images/hamster-fightclub.jpg",
        fallback: "🥊"
    },
    {
        id: 4,
        name: "BitQuest",
        bot: "https://t.me/BitquestGameSBot/start?startapp=kentId_6823288584

Присоединяйся ко мне в BitQuest и выигрывай крутые подарки в Telegram!",
        description: "Приключения в мире крипты",
        rating: 3.8,
        players: "245K",
        image: "images/bitquest.jpg",
        fallback: "💰"
    }
];

const EXCHANGES_DATA = [
    {
        id: 1,
        name: "Bybit",
        url: "https://www.bybit.com",
        description: "Продвинутая торговая платформа",
        image: "images/bybit.jpg",
        fallback: "💱"
    },
    {
        id: 2,
        name: "BingX",
        url: "https://www.bingx.com",
        description: "Социальная торговля и копирование",
        image: "images/bingx.jpg",
        fallback: "📈"
    },
    {
        id: 3,
        name: "Bitget",
        url: "https://www.bitget.com",
        description: "Инновационная торговая платформа",
        image: "images/bitget.jpg",
        fallback: "⚡"
    },
    {
        id: 4,
        name: "MEXC",
        url: "https://www.mexc.com",
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
        hamsterGameDevDesc: "Создай свою студию",
        hamsterKingDesc: "Стань королем хомяков",
        hamsterFightClubDesc: "Бойцовский клуб хомяков",
        bitquestDesc: "Приключения в мире крипты",
        pixelWorldDesc: "Строй свой мир в Pixel World Beta",
        play: "Играть",
        exchanges: "Биржи",
        exchangesDesc: "Торгуйте криптовалютами безопасно",
        bybitDesc: "Продвинутая торговая платформа",
        bingxDesc: "Социальная торговля и копирование",
        bitgetDesc: "Инновационная торговая платформа",
        mexcDesc: "Глобальная биржа с низкими комиссиями",
        user: "Пользователь",
        shareWithFriends: "Поделиться с друзьями",
        profile: "Профиль",
        linkCopied: "Ссылка скопирована в буфер обмена!",
        go: "Перейти"
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
        hamsterGameDevDesc: "Create your own studio",
        hamsterKingDesc: "Become the hamster king",
        hamsterFightClubDesc: "Hamster fighting club",
        bitquestDesc: "Adventures in the crypto world",
        pixelWorldDesc: "Build your world in Pixel World Beta",
        play: "Play",
        exchanges: "Exchanges",
        exchangesDesc: "Trade cryptocurrencies safely",
        bybitDesc: "Advanced trading platform",
        bingxDesc: "Social trading and copy trading",
        bitgetDesc: "Innovative trading platform",
        mexcDesc: "Global exchange with low fees",
        user: "User",
        shareWithFriends: "Share with friends",
        profile: "Profile",
        linkCopied: "Link copied to clipboard!",
        go: "Go"
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
    // Инициализация Telegram WebApp
    initializeTelegramWebApp();
    
    setupNavigation();
    initializeGames();
    initializeExchanges();
    setupSettingsPanel();
    loadThemePreference();
    loadLanguagePreference();
    loadUserData();
    setupShareButton();
    
    // Плавная загрузка контента
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

function initializeTelegramWebApp() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Развернуть приложение на весь экран
        tg.ready();
        tg.expand();
        
        // Применить цвета темы из Telegram
        const themeParams = tg.themeParams;
        if (themeParams) {
            if (themeParams.bg_color) {
                document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
            }
            if (themeParams.text_color) {
                document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color);
            }
            if (themeParams.button_color) {
                document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color);
            }
            if (themeParams.button_text_color) {
                document.documentElement.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color);
            }
        }
        
        console.log('✅ Telegram WebApp инициализирован');
    } else {
        console.log('⚠️ Telegram WebApp недоступен');
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ИГР ====================

function initializeGames() {
    const gamesGrid = document.getElementById('games-grid');
    if (!gamesGrid) return;
    
    gamesGrid.innerHTML = GAMES_DATA.map(game => {
        // Генерируем HTML для карточки
        let betaBadge = '';
        if (game.isBeta) {
            betaBadge = '<span class="beta-badge">BETA</span>';
        }
        
        return `
            <div class="game-card" data-game-id="${game.id}">
                ${betaBadge}
                <div class="game-image">
                    <img src="${game.image}" alt="${game.name}" class="game-img" onerror="this.style.display='none'">
                    <div class="image-fallback">${game.fallback}</div>
                </div>
                <div class="game-info">
                    <h3>${game.name}</h3>
                    <p class="game-description">${game.description}</p>
                    <div class="game-stats">
                        <div class="rating">
                            <div class="stars">
                                ${generateStars(game.rating)}
                            </div>
                            <span class="rating-value">${game.rating}</span>
                        </div>
                        <div class="players">
                            <span class="players-icon">👥</span>
                            <span class="players-count">${game.players}</span>
                        </div>
                    </div>
                </div>
                <button class="play-button" data-link="${game.link || ''}" data-bot="${game.bot || ''}">
                    ${getTranslation('play')}
                </button>
            </div>
        `;
    }).join('');
    
    setupGameButtons();
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Заполненные звезды
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star filled">★</span>';
    }
    
    // Половина звезды
    if (hasHalfStar) {
        stars += '<span class="star half">★</span>';
    }
    
    // Пустые звезды
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star">★</span>';
    }
    
    return stars;
}

// ==================== ИНИЦИАЛИЗАЦИЯ БИРЖ ====================

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

// ==================== ПРОФИЛЬ TELEGRAM ====================

function loadUserData() {
    if (window.Telegram && window.Telegram.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe?.user;
        
        if (user) {
            updateProfileDisplay(user);
            
            // Показываем расширенную информацию в консоли для отладки
            console.log('🔍 Telegram User Data:', {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                username: user.username,
                languageCode: user.language_code,
                photoUrl: user.photo_url,
                isPremium: user.is_premium
            });
        } else {
            showFallbackProfile();
            console.log('⚠️ Telegram user data not available');
        }
    } else {
        showFallbackProfile();
        console.log('🌐 Telegram Web App not available - running in browser');
    }
}

function updateProfileDisplay(user) {
    // Обновляем имя
    const userName = document.getElementById('user-name');
    if (userName) {
        const fullName = user.first_name + (user.last_name ? ' ' + user.last_name : '');
        userName.textContent = fullName;
    }
    
    // Обновляем username
    const userUsername = document.getElementById('user-username');
    if (userUsername) {
        if (user.username) {
            userUsername.textContent = '@' + user.username;
        } else {
            userUsername.textContent = 'Telegram User';
        }
    }
    
    // Обновляем аватар
    updateUserAvatar(user);
    
    // Показываем премиум статус если есть
    if (user.is_premium) {
        showPremiumBadge();
    }
}

function updateUserAvatar(user) {
    const userAvatar = document.getElementById('user-avatar');
    const avatarImg = document.getElementById('avatar-img');
    const avatarFallback = document.getElementById('avatar-fallback');
    
    if (!userAvatar) return;
    
    if (user.photo_url) {
        // Загружаем аватарку
        avatarImg.src = user.photo_url;
        avatarImg.style.display = 'block';
        avatarImg.alt = `${user.first_name}'s Avatar`;
        avatarImg.onerror = () => {
            // Если изображение не загрузилось, показываем fallback
            avatarImg.style.display = 'none';
            showAvatarFallback(user, avatarFallback);
        };
        avatarFallback.style.display = 'none';
    } else {
        // Показываем fallback аватар
        avatarImg.style.display = 'none';
        showAvatarFallback(user, avatarFallback);
    }
}

function showAvatarFallback(user, avatarFallback) {
    if (user.first_name) {
        avatarFallback.textContent = user.first_name.charAt(0).toUpperCase();
    } else {
        avatarFallback.textContent = 'T';
    }
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
    if (avatarFallback) {
        avatarFallback.textContent = 'T';
        avatarFallback.style.display = 'flex';
    }
}

// ==================== НАВИГАЦИЯ И КНОПКИ ====================

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            vibrate();
            const targetSection = this.getAttribute('data-section');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
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
            const bot = this.getAttribute('data-bot');
            
            let url = '';
            if (link) {
                // Если есть прямая ссылка (например, реферальная на игру)
                url = link;
            } else if (bot) {
                // Стандартный запуск бота
                url = `https://t.me/${bot}?start=app`;
            } else {
                console.error('Нет ссылки или бота для игры');
                return;
            }
            
            if (window.Telegram && window.Telegram.WebApp) {
                // Пробуем открыть встроенную ссылку Telegram
                window.Telegram.WebApp.openTelegramLink(url);
            } else {
                window.open(url, '_blank');
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
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.openLink(exchangeUrl);
                } else {
                    window.open(exchangeUrl, '_blank');
                }
            }
        });
    });
}

// ==================== НАСТРОЙКИ ====================

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
    
    // Close settings when clicking outside
    if (settingsPanel) {
        settingsPanel.addEventListener('click', function(e) {
            if (e.target === settingsPanel) {
                settingsPanel.classList.remove('active');
            }
        });
    }
    
    // Theme switcher in settings
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            vibrate();
            const theme = this.getAttribute('data-theme');
            
            // Update active state
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Apply theme
            if (theme === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
            
            // Save to localStorage
            localStorage.setItem('theme', theme);
        });
    });
    
    // Language switcher in settings
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            vibrate();
            const lang = this.getAttribute('data-lang');
            
            // Update active state
            languageOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Change language
            setLanguage(lang);
            
            // Save to localStorage
            localStorage.setItem('language', lang);
        });
    });
}

function setLanguage(lang) {
    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

function getTranslation(key) {
    const currentLang = localStorage.getItem('language') || 'ru';
    return translations[currentLang]?.[key] || key;
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
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

// ==================== ШАРИНГ ====================

function setupShareButton() {
    const shareButton = document.getElementById('share-friends-button');
    
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            vibrate();
            
            const botUrl = 'https://t.me/khamster_kombat_bot';
            const shareText = 'Открой для себя лучшие хомячьи игры Telegram в одном приложении! 🎮';
            
            // Проверяем доступность Telegram WebApp
            if (window.Telegram && window.Telegram.WebApp) {
                // Используем Telegram Share URL для открытия списка контактов
                const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(botUrl)}&text=${encodeURIComponent(shareText)}`;
                
                try {
                    // Открываем окно шаринга в Telegram
                    window.Telegram.WebApp.openTelegramLink(shareUrl);
                    console.log('✅ Открыто окно шаринга Telegram');
                } catch (error) {
                    console.error('Ошибка при открытии шаринга:', error);
                    // Fallback: копируем ссылку
                    fallbackCopyToClipboard(botUrl);
                }
            } else {
                // Если WebApp недоступен, пробуем Web Share API
                if (navigator.share) {
                    navigator.share({
                        title: 'Games Verse',
                        text: shareText,
                        url: botUrl,
                    })
                    .then(() => console.log('Успешный шаринг'))
                    .catch((error) => {
                        console.log('Ошибка шаринга', error);
                        fallbackCopyToClipboard(botUrl);
                    });
                } else {
                    // Fallback: копируем ссылку
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
    
    if (customMessage) {
        notification.textContent = customMessage;
    } else {
        // Reset to default message
        const currentLang = localStorage.getItem('language') || 'ru';
        notification.textContent = translations[currentLang].linkCopied;
    }
    
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}
