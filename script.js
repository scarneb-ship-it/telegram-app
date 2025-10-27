document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Translations object
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
        go: "Перейти",
        gamesPlayed: "Игр сыграно",
        friendsInvited: "Друзей приглашено"
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
        go: "Go",
        gamesPlayed: "Games played",
        friendsInvited: "Friends invited"
    }
};

function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function initializeApp() {
    setupNavigation();
    setupGameButtons();
    setupExchangeButtons();
    setupSettingsPanel();
    loadThemePreference();
    loadLanguagePreference();
    loadUserData();
    setupShareButton();
    
    // Плавная загрузка контента
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Telegram Web App integration
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.expand();
        
        const themeParams = window.Telegram.WebApp.themeParams;
        if (themeParams) {
            document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color || '#000000');
            document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color || '#667eea');
            document.documentElement.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color || '#ffffff');
        }
    }
}

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
            const botUsername = this.getAttribute('data-bot');
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

function loadUserData() {
    // Try to get user data from Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe?.user;
        
        if (user) {
            console.log('Telegram User Data:', user);
            
            // Update user name
            const userName = document.getElementById('user-name');
            if (userName && user.first_name) {
                const fullName = user.first_name + (user.last_name ? ' ' + user.last_name : '');
                userName.textContent = fullName;
            }
            
            // Update username
            const userUsername = document.getElementById('user-username');
            if (userUsername && user.username) {
                userUsername.textContent = '@' + user.username;
            } else if (userUsername) {
                userUsername.textContent = 'Telegram User';
            }
            
            // Update avatar
            const userAvatar = document.getElementById('user-avatar');
            const avatarImg = document.getElementById('avatar-img');
            const avatarFallback = document.getElementById('avatar-fallback');
            
            if (userAvatar && user.photo_url) {
                avatarImg.src = user.photo_url;
                avatarImg.style.display = 'block';
                avatarImg.alt = 'User Avatar';
                avatarFallback.style.display = 'none';
            } else if (userAvatar && user.first_name) {
                // Show first letter of first name as fallback
                avatarFallback.textContent = user.first_name.charAt(0).toUpperCase();
                avatarFallback.style.display = 'flex';
            }
        } else {
            console.log('No Telegram user data available');
        }
    } else {
        console.log('Telegram Web App not available');
        // Fallback: show demo data
        const userName = document.getElementById('user-name');
        const userUsername = document.getElementById('user-username');
        const avatarFallback = document.getElementById('avatar-fallback');
        
        if (userName) userName.textContent = 'Telegram User';
        if (userUsername) userUsername.textContent = '@username';
        if (avatarFallback) avatarFallback.textContent = 'T';
    }
}

function setupShareButton() {
    const shareButton = document.getElementById('share-friends-button');
    
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            vibrate();
            const shareUrl = window.location.href;
            const shareText = 'Открой для себя лучшие игры Telegram в одном приложении!';
            
            // Check if Web Share API is available
            if (navigator.share) {
                navigator.share({
                    title: 'Games Verse',
                    text: shareText,
                    url: shareUrl,
                })
                .then(() => console.log('Успешный шаринг'))
                .catch((error) => {
                    console.log('Ошибка шаринга', error);
                    fallbackCopyToClipboard(shareUrl);
                });
            } else {
                fallbackCopyToClipboard(shareUrl);
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
