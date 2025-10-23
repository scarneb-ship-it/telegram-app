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
        hamsterGameDevDesc: "Создай свою игровую студию и стань легендой",
        hamsterKingDesc: "Стань королем хомяков и построй империю",
        hamsterFightClubDesc: "Бойцовский клуб хомяков - стань чемпионом",
        bitquestDesc: "Приключения в мире криптовалют и блокчейна",
        play: "Играть",
        exchanges: "Биржи",
        exchangesDesc: "Торгуйте криптовалютами безопасно",
        bybitDesc: "Продвинутая торговая платформа с низкими комиссиями",
        bingxDesc: "Социальная торговля и копирование успешных трейдеров",
        bitgetDesc: "Инновационная торговая платформа с защитой капитала",
        mexcDesc: "Глобальная биржа с низкими комиссиями и 1000+ монет",
        user: "Пользователь",
        shareWithFriends: "Поделиться с друзьями",
        profile: "Профиль",
        linkCopied: "Ссылка скопирована в буфер обмена!",
        go: "Перейти",
        tradeGameFi: "Торгуйте монетами GameFi на популярных криптобиржах",
        explore: "Исследовать",
        gamesOpened: "Игр открыто",
        streakDays: "Дней подряд",
        friendsInvited: "Друзей приглашено",
        totalTime: "Всего времени",
        inviteFriends: "Пригласи друзей",
        inviteDescription: "Приглашай друзей и получай бонусы за каждого приглашенного!",
        friends: "друзей",
        bonusCoins: "бонусных монет",
        inviteNow: "Пригласить сейчас",
        achievements: "Достижения",
        firstGame: "Первая игра",
        firstGameDesc: "Запусти свою первую игру",
        weekStreak: "Неделя подряд",
        weekStreakDesc: "Заходи в приложение 7 дней подряд",
        socializer: "Общительный",
        socializerDesc: "Пригласи 5 друзей",
        veteran: "Ветеран",
        veteranDesc: "Проведи в играх 24 часа"
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
        hamsterGameDevDesc: "Create your own game studio and become a legend",
        hamsterKingDesc: "Become the hamster king and build an empire",
        hamsterFightClubDesc: "Hamster fighting club - become the champion",
        bitquestDesc: "Adventures in the world of cryptocurrencies and blockchain",
        play: "Play",
        exchanges: "Exchanges",
        exchangesDesc: "Trade cryptocurrencies safely",
        bybitDesc: "Advanced trading platform with low fees",
        bingxDesc: "Social trading and copy successful traders",
        bitgetDesc: "Innovative trading platform with capital protection",
        mexcDesc: "Global exchange with low fees and 1000+ coins",
        user: "User",
        shareWithFriends: "Share with friends",
        profile: "Profile",
        linkCopied: "Link copied to clipboard!",
        go: "Go",
        tradeGameFi: "Trade GameFi coins on popular crypto exchanges",
        explore: "Explore",
        gamesOpened: "Games opened",
        streakDays: "Day streak",
        friendsInvited: "Friends invited",
        totalTime: "Total time",
        inviteFriends: "Invite friends",
        inviteDescription: "Invite friends and get bonuses for each invited!",
        friends: "friends",
        bonusCoins: "bonus coins",
        inviteNow: "Invite now",
        achievements: "Achievements",
        firstGame: "First game",
        firstGameDesc: "Launch your first game",
        weekStreak: "Week streak",
        weekStreakDesc: "Open the app 7 days in a row",
        socializer: "Socializer",
        socializerDesc: "Invite 5 friends",
        veteran: "Veteran",
        veteranDesc: "Spend 24 hours in games"
    }
};

// User Statistics
let userStats = {
    gamesOpened: 0,
    streakDays: 0,
    friendsInvited: 0,
    totalTime: 0,
    lastLogin: null,
    achievements: {
        firstGame: false,
        weekStreak: false,
        socializer: false,
        veteran: false
    }
};

function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function initializeApp() {
    loadUserStats();
    setupNavigation();
    setupGameButtons();
    setupExchangeButtons();
    setupSettingsPanel();
    loadThemePreference();
    loadLanguagePreference();
    loadUserData();
    setupInviteButton();
    updateStreak();
    
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

function loadUserStats() {
    const savedStats = localStorage.getItem('userStats');
    if (savedStats) {
        userStats = JSON.parse(savedStats);
    }
    updateStatsDisplay();
}

function saveUserStats() {
    localStorage.setItem('userStats', JSON.stringify(userStats));
}

function updateStatsDisplay() {
    document.getElementById('games-opened').textContent = userStats.gamesOpened;
    document.getElementById('streak-days').textContent = userStats.streakDays;
    document.getElementById('friends-invited').textContent = userStats.friendsInvited;
    document.getElementById('total-time').textContent = Math.floor(userStats.totalTime / 60) + 'ч';
    
    // Update invite stats
    document.getElementById('invite-count').textContent = userStats.friendsInvited;
    document.getElementById('invite-bonus').textContent = userStats.friendsInvited * 50;
    
    // Update achievements
    updateAchievementsDisplay();
}

function updateStreak() {
    const today = new Date().toDateString();
    const lastLogin = userStats.lastLogin;
    
    if (!lastLogin) {
        // First login
        userStats.streakDays = 1;
    } else {
        const lastLoginDate = new Date(lastLogin);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastLoginDate.toDateString() === yesterday.toDateString()) {
            // Consecutive day
            userStats.streakDays++;
        } else if (lastLoginDate.toDateString() !== today) {
            // Broken streak
            userStats.streakDays = 1;
        }
    }
    
    userStats.lastLogin = today;
    saveUserStats();
    updateStatsDisplay();
}

function updateAchievementsDisplay() {
    // Update achievement completion states
    const achievements = document.querySelectorAll('.achievement');
    
    // First game achievement
    if (userStats.gamesOpened > 0 && !userStats.achievements.firstGame) {
        userStats.achievements.firstGame = true;
        achievements[0].classList.add('completed');
    }
    
    // Week streak achievement
    if (userStats.streakDays >= 7 && !userStats.achievements.weekStreak) {
        userStats.achievements.weekStreak = true;
        achievements[1].classList.add('completed');
    }
    
    // Socializer achievement
    if (userStats.friendsInvited >= 5 && !userStats.achievements.socializer) {
        userStats.achievements.socializer = true;
        achievements[2].classList.add('completed');
    } else {
        achievements[2].querySelector('.achievement-progress').textContent = 
            userStats.friendsInvited + '/5';
    }
    
    // Veteran achievement
    if (userStats.totalTime >= 1440 && !userStats.achievements.veteran) {
        userStats.achievements.veteran = true;
        achievements[3].classList.add('completed');
    } else {
        achievements[3].querySelector('.achievement-progress').textContent = 
            Math.floor(userStats.totalTime / 60) + '/24';
    }
    
    saveUserStats();
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
            
            // Track game opened
            userStats.gamesOpened++;
            userStats.totalTime += 5; // Add 5 minutes for each game session
            saveUserStats();
            updateStatsDisplay();
            
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
    const bannerButton = document.querySelector('.banner-button');
    
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
    
    if (bannerButton) {
        bannerButton.addEventListener('click', function() {
            vibrate();
            showNotification(document.getElementById('notification'), 'Исследуйте GameFi монеты!');
        });
    }
}

function setupInviteButton() {
    const inviteButton = document.getElementById('invite-friends-button');
    const notification = document.getElementById('notification');
    
    if (inviteButton) {
        inviteButton.addEventListener('click', function() {
            vibrate();
            
            // Track friend invited
            userStats.friendsInvited++;
            saveUserStats();
            updateStatsDisplay();
            
            const shareUrl = window.location.href;
            const shareText = 'Открой для себя лучшие игры Telegram в одном приложении! Присоединяйся к Games Verse!';
            
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
                    fallbackCopyToClipboard(shareUrl, notification);
                });
            } else {
                // Fallback: copy to clipboard
                fallbackCopyToClipboard(shareUrl, notification);
            }
        });
    }
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
            // Update user name
            const userName = document.getElementById('user-name');
            if (userName && user.first_name) {
                userName.textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
            }
            
            // Update username
            const userUsername = document.getElementById('user-username');
            if (userUsername && user.username) {
                userUsername.textContent = '@' + user.username;
            }
            
            // Update avatar
            const userAvatar = document.getElementById('user-avatar');
            const avatarImg = document.getElementById('avatar-img');
            const avatarFallback = document.getElementById('avatar-fallback');
            
            if (userAvatar && user.photo_url) {
                avatarImg.src = user.photo_url;
                avatarImg.style.display = 'block';
                avatarFallback.style.display = 'none';
            } else if (userAvatar && user.first_name) {
                // Show first letter of first name as fallback
                avatarFallback.textContent = user.first_name.charAt(0).toUpperCase();
            }
        }
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
        showNotification(notification, 'Не удалось скопировать ссылку');
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

// Simulate time spent in games (for demo purposes)
setInterval(() => {
    userStats.totalTime += 1;
    saveUserStats();
    updateStatsDisplay();
}, 60000); // Add 1 minute every minute
