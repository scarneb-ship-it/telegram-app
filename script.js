document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Updated translations object
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
        hamsterKingDesc: "Стань королем хомяков в этом эпическом приключении",
        hamsterFightClubDesc: "Бойцовский клуб хомяков - покажи кто сильнее!",
        bitquestDesc: "Приключения в мире криптовалют и блокчейна",
        play: "Играть",
        exchanges: "Биржи",
        exchangesDesc: "Торгуйте криптовалютами безопасно",
        bybitDesc: "Продвинутая торговая платформа с лучшими условиями",
        bingxDesc: "Социальная торговля и копирование сделок",
        bitgetDesc: "Инновационная торговая платформа с копи-трейдингом",
        mexcDesc: "Глобальная биржа с низкими комиссиями и быстрым листингом",
        user: "Пользователь",
        shareWithFriends: "Поделиться с друзьями",
        profile: "Профиль",
        linkCopied: "Ссылка скопирована в буфер обмена!",
        go: "Перейти",
        gamesOpened: "Игр открыто",
        streakDays: "Дней подряд",
        friendsInvited: "Друзей приглашено",
        totalPoints: "Всего очков",
        inviteFriends: "Пригласи друзей",
        inviteDescription: "Приглашай друзей и получай бонусные очки за каждого нового игрока!",
        perFriend: "за друга",
        for5friends: "за 5 друзей",
        inviteNow: "Пригласить друзей",
        recentAchievements: "Последние достижения",
        firstGame: "Первая игра",
        playFirstGame: "Сыграйте в первую игру",
        weekStreak: "Неделя подряд",
        "7daysActive": "7 дней активности",
        inviteMaster: "Мастер приглашений",
        invite10friends: "Пригласите 10 друзей"
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
        hamsterKingDesc: "Become the hamster king in this epic adventure",
        hamsterFightClubDesc: "Hamster fighting club - show who's stronger!",
        bitquestDesc: "Adventures in the world of cryptocurrencies and blockchain",
        play: "Play",
        exchanges: "Exchanges",
        exchangesDesc: "Trade cryptocurrencies safely",
        bybitDesc: "Advanced trading platform with the best conditions",
        bingxDesc: "Social trading and copy trading",
        bitgetDesc: "Innovative trading platform with copy trading",
        mexcDesc: "Global exchange with low fees and fast listing",
        user: "User",
        shareWithFriends: "Share with friends",
        profile: "Profile",
        linkCopied: "Link copied to clipboard!",
        go: "Go",
        gamesOpened: "Games opened",
        streakDays: "Days streak",
        friendsInvited: "Friends invited",
        totalPoints: "Total points",
        inviteFriends: "Invite friends",
        inviteDescription: "Invite friends and get bonus points for each new player!",
        perFriend: "per friend",
        for5friends: "for 5 friends",
        inviteNow: "Invite now",
        recentAchievements: "Recent achievements",
        firstGame: "First game",
        playFirstGame: "Play your first game",
        weekStreak: "Week streak",
        "7daysActive": "7 days active",
        inviteMaster: "Invite master",
        invite10friends: "Invite 10 friends"
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
    setupInviteButton();
    setupProfileStats();
    
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
            
            // Track game opening
            trackGameOpening();
            
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

function setupInviteButton() {
    const inviteButton = document.getElementById('invite-friends-button');
    const notification = document.getElementById('notification');
    
    if (inviteButton) {
        inviteButton.addEventListener('click', function() {
            vibrate();
            const shareUrl = window.location.href;
            
            // Track friend invitation
            trackFriendInvitation();
            
            // Check if Web Share API is available
            if (navigator.share) {
                navigator.share({
                    title: 'Games Verse',
                    text: 'Открой для себя лучшие игры Telegram в одном приложении! Присоединяйся сейчас!',
                    url: shareUrl,
                })
                .then(() => {
                    console.log('Успешный шаринг');
                    // Friend invitation tracked in trackFriendInvitation()
                })
                .catch((error) => console.log('Ошибка шаринга', error));
            } else {
                // Fallback: copy to clipboard
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

function setupProfileStats() {
    // Load stats from localStorage or initialize
    const stats = {
        gamesOpened: parseInt(localStorage.getItem('gamesOpened')) || 0,
        streakDays: parseInt(localStorage.getItem('streakDays')) || 0,
        friendsInvited: parseInt(localStorage.getItem('friendsInvited')) || 0,
        totalPoints: parseInt(localStorage.getItem('totalPoints')) || 0,
        lastVisit: localStorage.getItem('lastVisit') || null
    };
    
    // Update streak
    updateStreak(stats);
    
    // Update UI
    updateProfileStats(stats);
    
    // Save stats
    saveProfileStats(stats);
}

function updateStreak(stats) {
    const today = new Date().toDateString();
    const lastVisit = stats.lastVisit;
    
    if (!lastVisit) {
        // First visit
        stats.streakDays = 1;
    } else {
        const lastVisitDate = new Date(lastVisit);
        const todayDate = new Date();
        const diffTime = todayDate - lastVisitDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            // Consecutive day
            stats.streakDays += 1;
        } else if (diffDays > 1) {
            // Broken streak
            stats.streakDays = 1;
        }
        // If same day, streak remains the same
    }
    
    stats.lastVisit = today;
}

function trackGameOpening() {
    const stats = {
        gamesOpened: parseInt(localStorage.getItem('gamesOpened')) || 0,
        totalPoints: parseInt(localStorage.getItem('totalPoints')) || 0
    };
    
    stats.gamesOpened += 1;
    stats.totalPoints += 10; // 10 points per game opened
    
    updateProfileStats(stats);
    saveProfileStats(stats);
}

function trackFriendInvitation() {
    const stats = {
        friendsInvited: parseInt(localStorage.getItem('friendsInvited')) || 0,
        totalPoints: parseInt(localStorage.getItem('totalPoints')) || 0
    };
    
    stats.friendsInvited += 1;
    stats.totalPoints += 50; // 50 points per friend invited
    
    // Bonus for every 5 friends
    if (stats.friendsInvited % 5 === 0) {
        stats.totalPoints += 500;
    }
    
    updateProfileStats(stats);
    saveProfileStats(stats);
}

function updateProfileStats(stats) {
    document.getElementById('games-opened').textContent = stats.gamesOpened;
    document.getElementById('streak-days').textContent = stats.streakDays;
    document.getElementById('friends-invited').textContent = stats.friendsInvited;
    document.getElementById('total-points').textContent = stats.totalPoints.toLocaleString();
}

function saveProfileStats(stats) {
    localStorage.setItem('gamesOpened', stats.gamesOpened);
    localStorage.setItem('streakDays', stats.streakDays);
    localStorage.setItem('friendsInvited', stats.friendsInvited);
    localStorage.setItem('totalPoints', stats.totalPoints);
    localStorage.setItem('lastVisit', stats.lastVisit);
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
