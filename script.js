// Game URLs - замените на реальные URL ваших игр
const GAME_URLS = {
    hamster: "https://example.com/hamster-game",
    notcoin: "https://example.com/notcoin-game", 
    king: "https://example.com/hamster-king",
    fight: "https://example.com/fight-club",
    miner: "https://example.com/crypto-miner",
    adventure: "https://example.com/tap-adventure"
};

// Game Names
const GAME_NAMES = {
    hamster: "Hamster Kombat",
    notcoin: "Notcoin",
    king: "Hamster King", 
    fight: "Fight Club",
    miner: "Crypto Miner",
    adventure: "Tap Adventure"
};

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
        bestGames: "Лучшие игры в одном приложении",
        hamsterGameDesc: "Тапы и комбо для заработка",
        notcoinDesc: "Кликай и зарабатывай",
        hamsterKingDesc: "Стань королем хомяков",
        fightClubDesc: "Бойцовский клуб хомяков",
        cryptoMinerDesc: "Майнинг криптовалюты",
        tapAdventureDesc: "Приключения с тапами",
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
        inviteDesc: "Делись лучшими играми со своими друзьями",
        shareLink: "Поделиться ссылкой",
        loadingGame: "Загрузка игры..."
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
        bestGames: "Best games in one app",
        hamsterGameDesc: "Taps and combos for earning",
        notcoinDesc: "Click and earn",
        hamsterKingDesc: "Become the hamster king",
        fightClubDesc: "Hamster fighting club",
        cryptoMinerDesc: "Crypto mining",
        tapAdventureDesc: "Tap adventures",
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
        inviteDesc: "Share the best games with your friends",
        shareLink: "Share link",
        loadingGame: "Loading game..."
    }
};

// Глобальные переменные
let currentUser = null;
let userTelegramId = null;
let tg = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
}

async function initializeApp() {
    // Инициализация Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        
        // Применение темы Telegram
        applyTelegramTheme();
    }
    
    setupNavigation();
    setupGameButtons();
    setupExchangeButtons();
    setupSettingsPanel();
    setupGameModal();
    loadThemePreference();
    loadLanguagePreference();
    
    // Загрузка данных пользователя
    await loadUserData();
    
    setupShareButton();
    
    // Обновление статистики
    updateStreak();
    
    // Плавная загрузка контента
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

function applyTelegramTheme() {
    if (!tg) return;
    
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

async function loadUserData() {
    // Если Telegram Web App доступен, используем данные пользователя
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        userTelegramId = user.id.toString();
        
        // Обновление интерфейса с данными пользователя
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
        
        // Обновление аватара
        const avatarImg = document.getElementById('avatar-img');
        const avatarFallback = document.getElementById('avatar-fallback');
        
        if (user.photo_url) {
            avatarImg.src = user.photo_url;
            avatarImg.style.display = 'block';
            avatarFallback.style.display = 'none';
        } else if (user.first_name) {
            avatarFallback.textContent = user.first_name.charAt(0).toUpperCase();
        }
    } else {
        // Fallback для тестирования вне Telegram
        console.log('Telegram user data not available - using test mode');
        document.getElementById('user-name').textContent = 'Тестовый пользователь';
        document.getElementById('user-username').textContent = '@testuser';
    }
    
    // Загрузка статистики из localStorage
    loadLocalStats();
}

function loadLocalStats() {
    const gamesOpened = parseInt(localStorage.getItem('gamesOpened') || '0');
    const streak = parseInt(localStorage.getItem('streak') || '0');
    const friendsInvited = parseInt(localStorage.getItem('friendsInvited') || '0');
    
    document.getElementById('games-opened').textContent = gamesOpened;
    document.getElementById('streak-days').textContent = streak;
    document.getElementById('friends-invited').textContent = friendsInvited;
}

function incrementGamesOpened() {
    let gamesOpened = parseInt(localStorage.getItem('gamesOpened') || '0');
    gamesOpened++;
    localStorage.setItem('gamesOpened', gamesOpened.toString());
    document.getElementById('games-opened').textContent = gamesOpened;
}

function updateStreak() {
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
            const gameKey = this.getAttribute('data-game');
            
            if (gameKey && GAME_URLS[gameKey]) {
                openGame(gameKey);
            } else {
                console.error('Game URL not found for:', gameKey);
            }
        });
    });
}

function setupGameModal() {
    const gameModal = document.getElementById('game-modal');
    const backButton = document.getElementById('back-from-game');
    const closeButton = document.getElementById('close-game');
    const fullscreenButton = document.getElementById('fullscreen-btn');
    const gameIframe = document.getElementById('game-iframe');
    const gameLoading = document.getElementById('game-loading');
    
    // Кнопка "Назад"
    backButton.addEventListener('click', function() {
        vibrate();
        closeGameModal();
    });
    
    // Кнопка закрытия
    closeButton.addEventListener('click', function() {
        vibrate();
        closeGameModal();
    });
    
    // Кнопка полноэкранного режима
    fullscreenButton.addEventListener('click', function() {
        vibrate();
        toggleFullscreen();
    });
    
    // Обработка загрузки iframe
    gameIframe.addEventListener('load', function() {
        gameLoading.style.display = 'none';
        gameIframe.style.display = 'block';
    });
    
    // Закрытие по клику вне контента (если нужно)
    gameModal.addEventListener('click', function(e) {
        if (e.target === gameModal) {
            closeGameModal();
        }
    });
}

function openGame(gameKey) {
    const gameModal = document.getElementById('game-modal');
    const gameIframe = document.getElementById('game-iframe');
    const gameTitle = document.getElementById('game-modal-title');
    const gameLoading = document.getElementById('game-loading');
    
    // Увеличиваем счетчик открытых игр
    incrementGamesOpened();
    
    // Устанавливаем заголовок
    gameTitle.textContent = GAME_NAMES[gameKey] || 'Игра';
    
    // Показываем модальное окно
    gameModal.classList.add('active');
    
    // Показываем загрузку и скрываем iframe
    gameLoading.style.display = 'flex';
    gameIframe.style.display = 'none';
    
    // Загружаем игру в iframe
    setTimeout(() => {
        gameIframe.src = GAME_URLS[gameKey];
    }, 500);
}

function closeGameModal() {
    const gameModal = document.getElementById('game-modal');
    const gameIframe = document.getElementById('game-iframe');
    
    gameModal.classList.remove('active');
    
    // Останавливаем загрузку iframe
    setTimeout(() => {
        gameIframe.src = '';
    }, 300);
}

function toggleFullscreen() {
    const gameIframe = document.getElementById('game-iframe');
    
    if (!document.fullscreenElement) {
        if (gameIframe.requestFullscreen) {
            gameIframe.requestFullscreen();
        } else if (gameIframe.webkitRequestFullscreen) {
            gameIframe.webkitRequestFullscreen();
        } else if (gameIframe.msRequestFullscreen) {
            gameIframe.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function setupExchangeButtons() {
    const exchangeButtons = document.querySelectorAll('.exchange-button');
    
    exchangeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            vibrate();
            const exchangeUrl = this.getAttribute('data-url');
            if (exchangeUrl) {
                if (tg && tg.openLink) {
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
    const savedTheme = localStorage.getItem('theme') || (tg && tg.colorScheme === 'dark' ? 'dark' : 'light');
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
            
            const shareText = 'Присоединяйся к Games Verse - лучшие игры в одном приложении! 🎮';
            const shareUrl = window.location.href;
            
            // Используем Telegram Web App API для шаринга
            if (tg && tg.openTelegramLink) {
                const shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
                tg.openTelegramLink(shareLink);
            } else if (navigator.share) {
                navigator.share({
                    title: 'Games Verse',
                    text: shareText,
                    url: shareUrl,
                })
                .then(() => {
                    console.log('Успешный шаринг');
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

// Обработка выхода из полноэкранного режима
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (!document.fullscreenElement) {
        fullscreenBtn.textContent = '⛶';
    } else {
        fullscreenBtn.textContent = '⛷';
    }
}
