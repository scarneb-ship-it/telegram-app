// API Configuration
const API_BASE_URL = window.location.origin + '/api';

// Telegram Web App
let tg = window.Telegram.WebApp;

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
        tradeGameFi: "Торгуйте монетами GameFi на популярных криптобиржах",
        gamesOpened: "Игр открыто",
        streakDays: "Дней подряд",
        friendsInvited: "Друзей",
        editProfile: "Редактировать профиль",
        achievements: "Достижения",
        inviteTitle: "Пригласи друзей!",
        inviteDesc: "Делись лучшими играми Telegram со своими друзьями",
        shareLink: "Поделиться ссылкой"
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
        tradeGameFi: "Trade GameFi coins on popular crypto exchanges",
        gamesOpened: "Games opened",
        streakDays: "Days streak",
        friendsInvited: "Friends",
        editProfile: "Edit profile",
        achievements: "Achievements",
        inviteTitle: "Invite friends!",
        inviteDesc: "Share the best Telegram games with your friends",
        shareLink: "Share link"
    }
};

// Global variables
let currentUser = null;
let userTelegramId = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

async function initializeApp() {
    // Initialize Telegram Web App
    tg.ready();
    tg.expand();

    // Apply Telegram theme
    applyTelegramTheme();

    setupNavigation();
    setupGameButtons();
    setupExchangeButtons();
    setupSettingsPanel();
    loadThemePreference();
    loadLanguagePreference();

    // Load Telegram user data
    await loadTelegramUserData();

    setupShareButton();

    // Check referral link
    await checkReferral();

    // Update streak on each visit
    if (userTelegramId) {
        await updateStreak();
    }

    // Smooth content loading
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

function applyTelegramTheme() {
    if (tg.colorScheme === 'dark') {
        document.body.classList.add('dark-theme');
        updateSettingsThemeOptions('dark');
    }

    const themeParams = tg.themeParams;
    if (themeParams) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color || '#000000');
        document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color || '#667eea');
        document.documentElement.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color || '#ffffff');
    }
}

async function loadTelegramUserData() {
    const user = tg.initDataUnsafe?.user;

    if (user) {
        userTelegramId = user.id.toString();

        // Update interface with user data
        const userName = document.getElementById('user-name');
        if (userName && user.first_name) {
            userName.textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
        }

        const userUsername = document.getElementById('user-username');
        if (userUsername && user.username) {
            userUsername.textContent = '@' + user.username;
        } else if (userUsername) {
            userUsername.textContent = 'ID: ' + user.id;
        }

        // Update avatar
        const avatarImg = document.getElementById('avatar-img');
        const avatarFallback = document.getElementById('avatar-fallback');

        if (user.photo_url) {
            avatarImg.src = user.photo_url;
            avatarImg.style.display = 'block';
            avatarFallback.style.display = 'none';
        } else if (user.first_name) {
            avatarFallback.textContent = user.first_name.charAt(0).toUpperCase();
        }

        // Load or create user profile
        await loadOrCreateUserProfile(user);
    } else {
        // Fallback for testing outside Telegram
        console.log('Telegram user data not available - using test mode');
        loadLocalStats();
    }
}

async function loadOrCreateUserProfile(telegramUser) {
    try {
        // Try to get user profile
        const response = await fetch(`${API_BASE_URL}/users/${telegramUser.id}`);

        if (response.ok) {
            // User exists
            currentUser = await response.json();
            updateProfileStats();
        } else if (response.status === 404) {
            // User not found, create new profile
            const newUser = {
                telegram_id: telegramUser.id.toString(),
                first_name: telegramUser.first_name,
                last_name: telegramUser.last_name || null,
                username: telegramUser.username || null,
                photo_url: telegramUser.photo_url || null,
                referred_by: localStorage.getItem('referredBy') || null
            };

            const createResponse = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (createResponse.ok) {
                currentUser = await createResponse.json();
                updateProfileStats();
            }
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        // Fallback to localStorage
        loadLocalStats();
    }
}

function loadLocalStats() {
    // Fallback loading from localStorage
    const gamesOpened = parseInt(localStorage.getItem('gamesOpened') || '0');
    const streak = parseInt(localStorage.getItem('streak') || '0');
    const friendsInvited = parseInt(localStorage.getItem('friendsInvited') || '0');

    document.getElementById('games-opened').textContent = gamesOpened;
    document.getElementById('streak-days').textContent = streak;
    document.getElementById('friends-invited').textContent = friendsInvited;
}

function updateProfileStats() {
    if (currentUser) {
        document.getElementById('games-opened').textContent = currentUser.games_opened || 0;
        document.getElementById('streak-days').textContent = currentUser.streak_days || 0;
        document.getElementById('friends-invited').textContent = currentUser.friends_invited || 0;
    }
}

async function incrementGamesOpened() {
    if (userTelegramId) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userTelegramId}/game-opened`, {
                method: 'POST'
            });

            if (response.ok) {
                currentUser = await response.json();
                updateProfileStats();
            }
        } catch (error) {
            console.error('Error incrementing games opened:', error);
            // Fallback to localStorage
            let gamesOpened = parseInt(localStorage.getItem('gamesOpened') || '0');
            gamesOpened++;
            localStorage.setItem('gamesOpened', gamesOpened.toString());
            document.getElementById('games-opened').textContent = gamesOpened;
        }
    } else {
        // Fallback for testing
        let gamesOpened = parseInt(localStorage.getItem('gamesOpened') || '0');
        gamesOpened++;
        localStorage.setItem('gamesOpened', gamesOpened.toString());
        document.getElementById('games-opened').textContent = gamesOpened;
    }
}

async function updateStreak() {
    if (userTelegramId) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userTelegramId}/check-streak`, {
                method: 'POST'
            });

            if (response.ok) {
                currentUser = await response.json();
                updateProfileStats();
            }
        } catch (error) {
            console.error('Error updating streak:', error);
            // Fallback to localStorage
            updateStreakLocal();
        }
    } else {
        updateStreakLocal();
    }
}

function updateStreakLocal() {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('lastVisit');
    let streak = parseInt(localStorage.getItem('streak') || '0');

    if (lastVisit) {
        const lastVisitDate = new Date(lastVisit);
        const todayDate = new Date(today);
        const diffTime = todayDate - lastVisitDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            streak++;
        } else if (diffDays > 1) {
            streak = 1;
        }
    } else {
        streak = 1;
    }

    localStorage.setItem('streak', streak.toString());
    localStorage.setItem('lastVisit', today);
    document.getElementById('streak-days').textContent = streak;
}

async function checkReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const refId = urlParams.get('ref') || urlParams.get('start');

    if (refId && userTelegramId && refId !== userTelegramId) {
        const hasBeenReferred = localStorage.getItem('hasBeenReferred');

        if (!hasBeenReferred) {
            localStorage.setItem('hasBeenReferred', 'true');
            localStorage.setItem('referredBy', refId);
            console.log('Invited by user:', refId);
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

function setupGameButtons() {
    const playButtons = document.querySelectorAll('.play-button');

    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            vibrate();
            const botUsername = this.getAttribute('data-bot');
            const gameId = this.getAttribute('data-game-id');

            if (gameId) {
                incrementGamesOpened();
            }

            if (botUsername) {
                const telegramUrl = `https://t.me/${botUsername}?start=app`;

                if (tg.openTelegramLink) {
                    tg.openTelegramLink(telegramUrl);
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
                if (tg.openLink) {
                    tg.openLink(exchangeUrl);
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

    if (settingsPanel) {
        settingsPanel.addEventListener('click', function(e) {
            if (e.target === settingsPanel) {
                settingsPanel.classList.remove('active');
            }
        });
    }

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

            localStorage.setItem('theme', theme);
        });
    });

    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            vibrate();
            const lang = this.getAttribute('data-lang');

            languageOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            setLanguage(lang);
            localStorage.setItem('language', lang);
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
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme') || (tg.colorScheme === 'dark' ? 'dark' : 'light');
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

function setupShareButton() {
    const shareButton = document.getElementById('share-friends-button');
    const notification = document.getElementById('notification');

    if (shareButton) {
        shareButton.addEventListener('click', function() {
            vibrate();

            const userId = userTelegramId || 'default';
            const botUsername = 'games_verse_bot'; // Replace with your bot username
            const shareUrl = `https://t.me/${botUsername}?start=${userId}`;
            const shareText = 'Присоединяйся к Games Verse - лучшие игры Telegram в одном приложении! 🎮';

            // Use Telegram Web App API for sharing
            if (tg.openTelegramLink) {
                const shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
                tg.openTelegramLink(shareLink);
            } else if (navigator.share) {
                navigator.share({
                    title: 'Games Verse',
                    text: shareText,
                    url: shareUrl,
                })
                .then(() => {
                    console.log('Successful sharing');
                })
                .catch((error) => console.log('Sharing error', error));
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
        showNotification(notification, 'Failed to copy link');
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
