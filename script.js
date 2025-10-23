// ===================================
// Configuration
// ===================================
const CONFIG = {
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8001/api' 
        : `${window.location.origin}/api`,
    STORAGE_KEYS: {
        THEME: 'gamesverse_theme',
        LANGUAGE: 'gamesverse_language',
        USER_ID: 'gamesverse_user_id',
        ADMIN_AUTH: 'gamesverse_admin_auth',
        BROADCAST_SEEN: 'gamesverse_broadcast_seen'
    }
};

// ===================================
// Translations
// ===================================
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
        exchanges: "Биржи",
        exchangesDesc: "Торгуйте криптовалютами безопасно",
        profile: "Профиль",
        user: "Пользователь",
        gamesPlayed: "Игр запущено",
        referrals: "Рефералов",
        inviteFriends: "Пригласи друзей",
        referralDesc: "Получай бонусы за каждого друга",
        shareWithFriends: "Поделиться с друзьями",
        linkCopied: "Ссылка скопирована!",
        play: "Играть",
        go: "Перейти",
        open: "Открыть",
        // Game descriptions
        hamsterGameDevDesc: "Создай свою студию",
        hamsterKingDesc: "Стань королем хомяков",
        hamsterFightClubDesc: "Бойцовский клуб хомяков",
        bitquestDesc: "Приключения в мире крипты",
        notcoinDesc: "Кликай и зарабатывай",
        catizenDesc: "Мир милых котиков",
        pixeltapDesc: "Пиксельные приключения",
        yescoinDesc: "Свайпай и зарабатывай",
        // Exchange descriptions
        bybitDesc: "Продвинутая торговая платформа",
        bingxDesc: "Социальная торговля и копирование",
        bitgetDesc: "Инновационная торговая платформа",
        mexcDesc: "Глобальная биржа с низкими комиссиями",
        okxDesc: "Ведущая криптобиржа",
        gateDesc: "Безопасная торговля с 2013 года"
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
        exchanges: "Exchanges",
        exchangesDesc: "Trade cryptocurrencies safely",
        profile: "Profile",
        user: "User",
        gamesPlayed: "Games Played",
        referrals: "Referrals",
        inviteFriends: "Invite Friends",
        referralDesc: "Get bonuses for each friend",
        shareWithFriends: "Share with friends",
        linkCopied: "Link copied!",
        play: "Play",
        go: "Go",
        open: "Open",
        // Game descriptions
        hamsterGameDevDesc: "Create your own studio",
        hamsterKingDesc: "Become the hamster king",
        hamsterFightClubDesc: "Hamster fighting club",
        bitquestDesc: "Adventures in the crypto world",
        notcoinDesc: "Tap and earn",
        catizenDesc: "World of cute cats",
        pixeltapDesc: "Pixel adventures",
        yescoinDesc: "Swipe and earn",
        // Exchange descriptions
        bybitDesc: "Advanced trading platform",
        bingxDesc: "Social trading and copy trading",
        bitgetDesc: "Innovative trading platform",
        mexcDesc: "Global exchange with low fees",
        okxDesc: "Leading crypto exchange",
        gateDesc: "Safe trading since 2013"
    }
};

// ===================================
// Utility Functions
// ===================================
function vibrate(duration = 50) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

function showNotification(message, duration = 2000) {
    const notification = document.getElementById('notification') || document.getElementById('admin-notification');
    const notificationText = document.getElementById('notification-text') || document.getElementById('admin-notification-text');
    
    if (notification && notificationText) {
        notificationText.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    }
}

function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, lang);
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    updateSettingsThemeOptions(savedTheme);
}

function loadLanguagePreference() {
    const savedLang = localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE) || 'ru';
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

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'только что';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин назад`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч назад`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} д назад`;
    
    return date.toLocaleDateString('ru-RU');
}

// ===================================
// API Functions
// ===================================
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${CONFIG.API_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// ===================================
// User Functions
// ===================================
async function registerOrUpdateUser(userData) {
    try {
        const user = await apiCall('/user/register', 'POST', userData);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_ID, user.id);
        return user;
    } catch (error) {
        console.error('Error registering user:', error);
        return null;
    }
}

async function trackActivity(actionType, targetId = null) {
    const userId = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_ID);
    if (!userId) return;
    
    try {
        await apiCall('/user/activity', 'POST', {
            user_id: userId,
            action_type: actionType,
            target_id: targetId
        });
    } catch (error) {
        console.error('Error tracking activity:', error);
    }
}

function loadUserData() {
    // Try to get user data from Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe?.user;
        
        if (user) {
            // Register/update user in database
            const referrerId = new URLSearchParams(window.location.search).get('ref');
            registerOrUpdateUser({
                telegram_id: user.id?.toString(),
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                photo_url: user.photo_url,
                referrer_id: referrerId
            });
            
            // Update UI
            const userName = document.getElementById('user-name');
            if (userName && user.first_name) {
                userName.textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
            }
            
            const userUsername = document.getElementById('user-username');
            if (userUsername && user.username) {
                userUsername.textContent = '@' + user.username;
            }
            
            const userAvatar = document.getElementById('user-avatar');
            const avatarImg = document.getElementById('avatar-img');
            const avatarFallback = document.getElementById('avatar-fallback');
            
            if (userAvatar && user.photo_url) {
                avatarImg.src = user.photo_url;
                avatarImg.style.display = 'block';
                avatarFallback.style.display = 'none';
            } else if (userAvatar && user.first_name) {
                avatarFallback.textContent = user.first_name.charAt(0).toUpperCase();
            }
            
            // Update referral link
            const referralLink = document.getElementById('referral-link');
            if (referralLink) {
                const userId = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_ID);
                referralLink.value = `${window.location.origin}/?ref=${userId}`;
            }
        }
    } else {
        // Fallback for testing outside Telegram
        const userId = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_ID);
        if (!userId) {
            const newUserId = 'user_' + Date.now();
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER_ID, newUserId);
            registerOrUpdateUser({
                telegram_id: newUserId,
                username: 'testuser',
                first_name: 'Test',
                last_name: 'User'
            });
        }
        
        const referralLink = document.getElementById('referral-link');
        if (referralLink) {
            const userId = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_ID);
            referralLink.value = `${window.location.origin}/?ref=${userId}`;
        }
    }
    
    // Track app open
    trackActivity('app_open');
}

// ===================================
// Main App Functions
// ===================================
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
            
            // Track section view
            trackActivity('section_view', targetSection);
        });
    });
}

function setupGameButtons() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        const playButton = card.querySelector('.play-button');
        const botUsername = card.getAttribute('data-bot');
        
        if (playButton && botUsername) {
            playButton.addEventListener('click', function(e) {
                e.stopPropagation();
                vibrate();
                
                const telegramUrl = `https://t.me/${botUsername}?start=app`;
                
                // Track game click
                trackActivity('game_click', botUsername);
                
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.openTelegramLink(telegramUrl);
                } else {
                    window.open(telegramUrl, '_blank');
                }
            });
        }
    });
}

function setupExchangeButtons() {
    const exchangeCards = document.querySelectorAll('.exchange-card');
    
    exchangeCards.forEach(card => {
        const exchangeButton = card.querySelector('.exchange-button');
        const exchangeUrl = card.getAttribute('data-url');
        const exchangeName = card.querySelector('h3')?.textContent;
        
        if (exchangeButton && exchangeUrl) {
            exchangeButton.addEventListener('click', function(e) {
                e.stopPropagation();
                vibrate();
                
                // Track exchange click
                trackActivity('exchange_click', exchangeName);
                
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.openLink(exchangeUrl);
                } else {
                    window.open(exchangeUrl, '_blank');
                }
            });
        }
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
            
            localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, theme);
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
            
            setLanguage(lang);
        });
    });
}

function setupShareButton() {
    const shareButton = document.getElementById('share-friends-button');
    const copyButton = document.getElementById('copy-referral');
    
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            vibrate();
            const userId = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_ID);
            const shareUrl = `${window.location.origin}/?ref=${userId}`;
            const shareText = 'Открой для себя лучшие игры Telegram в одном приложении!';
            
            if (navigator.share) {
                navigator.share({
                    title: 'Games Verse',
                    text: shareText,
                    url: shareUrl,
                }).catch(() => {});
            } else {
                copyToClipboard(shareUrl);
            }
        });
    }
    
    if (copyButton) {
        copyButton.addEventListener('click', function() {
            vibrate();
            const referralLink = document.getElementById('referral-link');
            if (referralLink) {
                copyToClipboard(referralLink.value);
            }
        });
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification(translations[localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE) || 'ru'].linkCopied);
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
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
        showNotification(translations[localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE) || 'ru'].linkCopied);
    } catch (err) {
        console.error('Copy failed:', err);
    }
}

async function loadLatestBroadcast() {
    try {
        const broadcast = await apiCall('/broadcasts/latest');
        if (broadcast) {
            const seenBroadcastId = localStorage.getItem(CONFIG.STORAGE_KEYS.BROADCAST_SEEN);
            if (seenBroadcastId !== broadcast.id) {
                showBroadcastBanner(broadcast);
            }
        }
    } catch (error) {
        console.error('Error loading broadcast:', error);
    }
}

function showBroadcastBanner(broadcast) {
    const banner = document.getElementById('broadcast-banner');
    const title = document.getElementById('broadcast-title');
    const message = document.getElementById('broadcast-message');
    const image = document.getElementById('broadcast-image');
    const link = document.getElementById('broadcast-link');
    const closeBtn = document.getElementById('broadcast-close');
    
    if (!banner) return;
    
    title.textContent = broadcast.title;
    message.textContent = broadcast.text;
    
    if (broadcast.image_url) {
        image.src = broadcast.image_url;
        image.style.display = 'block';
    } else {
        image.style.display = 'none';
    }
    
    if (broadcast.link_url) {
        link.style.display = 'block';
        link.onclick = () => {
            vibrate();
            if (window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.openLink(broadcast.link_url);
            } else {
                window.open(broadcast.link_url, '_blank');
            }
        };
    } else {
        link.style.display = 'none';
    }
    
    banner.style.display = 'block';
    
    closeBtn.onclick = () => {
        banner.style.display = 'none';
        localStorage.setItem(CONFIG.STORAGE_KEYS.BROADCAST_SEEN, broadcast.id);
    };
}

// ===================================
// Admin Panel Functions
// ===================================
function setupAdminLogin() {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            vibrate();
            
            const password = document.getElementById('password').value;
            
            try {
                const result = await apiCall('/admin/login', 'POST', { password });
                if (result.status === 'success') {
                    localStorage.setItem(CONFIG.STORAGE_KEYS.ADMIN_AUTH, 'true');
                    showAdminDashboard();
                }
            } catch (error) {
                loginError.textContent = 'Неверный пароль';
                loginError.style.display = 'block';
                vibrate(100);
            }
        });
    }
}

function showAdminDashboard() {
    const loginScreen = document.getElementById('admin-login');
    const dashboard = document.getElementById('admin-dashboard');
    
    if (loginScreen && dashboard) {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'block';
        
        loadAdminStats();
        loadAdminUsers();
        loadBroadcastsHistory();
    }
}

function setupAdminNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    const tabs = document.querySelectorAll('.admin-tab');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            vibrate();
            const targetTab = this.getAttribute('data-tab') + '-tab';
            
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            tabs.forEach(tab => {
                tab.classList.remove('active');
                if (tab.id === targetTab) {
                    tab.classList.add('active');
                }
            });
        });
    });
}

function setupAdminLogout() {
    const logoutButton = document.getElementById('logout-button');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            vibrate();
            localStorage.removeItem(CONFIG.STORAGE_KEYS.ADMIN_AUTH);
            location.reload();
        });
    }
}

async function loadAdminStats() {
    try {
        const stats = await apiCall('/admin/stats');
        
        document.getElementById('total-users').textContent = stats.total_users.toLocaleString();
        document.getElementById('new-users-today').textContent = stats.new_users_today.toLocaleString();
        document.getElementById('new-users-week').textContent = stats.new_users_week.toLocaleString();
        document.getElementById('active-users-today').textContent = stats.active_users_today.toLocaleString();
        document.getElementById('total-game-clicks').textContent = stats.total_game_clicks.toLocaleString();
        document.getElementById('total-exchange-clicks').textContent = stats.total_exchange_clicks.toLocaleString();
        
        renderTopGamesChart(stats.top_games);
        renderTopExchangesChart(stats.top_exchanges);
        renderUserGrowthChart(stats.user_growth);
    } catch (error) {
        console.error('Error loading admin stats:', error);
    }
}

function renderTopGamesChart(data) {
    const container = document.getElementById('top-games-chart');
    if (!data || data.length === 0) {
        container.innerHTML = '<p class="no-data">Нет данных</p>';
        return;
    }
    
    const maxClicks = Math.max(...data.map(item => item.clicks));
    
    container.innerHTML = data.map(item => `
        <div class="bar-item">
            <div class="bar-label">${item.name}</div>
            <div class="bar-container">
                <div class="bar" style="width: ${(item.clicks / maxClicks * 100)}%"></div>
                <span class="bar-value">${item.clicks}</span>
            </div>
        </div>
    `).join('');
}

function renderTopExchangesChart(data) {
    const container = document.getElementById('top-exchanges-chart');
    if (!data || data.length === 0) {
        container.innerHTML = '<p class="no-data">Нет данных</p>';
        return;
    }
    
    const maxClicks = Math.max(...data.map(item => item.clicks));
    
    container.innerHTML = data.map(item => `
        <div class="bar-item">
            <div class="bar-label">${item.name}</div>
            <div class="bar-container">
                <div class="bar" style="width: ${(item.clicks / maxClicks * 100)}%"></div>
                <span class="bar-value">${item.clicks}</span>
            </div>
        </div>
    `).join('');
}

function renderUserGrowthChart(data) {
    const container = document.getElementById('user-growth-chart');
    if (!data || data.length === 0) {
        container.innerHTML = '<p class="no-data">Нет данных</p>';
        return;
    }
    
    const maxCount = Math.max(...data.map(item => item.count), 1);
    
    container.innerHTML = `
        <div class="line-chart">
            ${data.map((item, index) => `
                <div class="line-item">
                    <div class="line-bar" style="height: ${(item.count / maxCount * 100)}%">
                        <span class="line-value">${item.count}</span>
                    </div>
                    <div class="line-label">${new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</div>
                </div>
            `).join('')}
        </div>
    `;
}

async function loadAdminUsers() {
    try {
        const result = await apiCall('/admin/users?limit=100');
        const tbody = document.getElementById('users-table-body');
        const usersCount = document.getElementById('users-count');
        
        if (usersCount) {
            usersCount.textContent = result.total;
        }
        
        if (!result.users || result.users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Пользователей пока нет</td></tr>';
            return;
        }
        
        tbody.innerHTML = result.users.map(user => `
            <tr>
                <td><code>${user.telegram_id || user.id}</code></td>
                <td>${user.first_name || ''} ${user.last_name || ''}</td>
                <td>${user.username ? '@' + user.username : '-'}</td>
                <td>${formatDate(user.created_at)}</td>
                <td>${formatDate(user.last_active)}</td>
                <td>${user.referrer_id ? '✅' : '-'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function setupBroadcastForm() {
    const form = document.getElementById('broadcast-form');
    const titleInput = document.getElementById('broadcast-title');
    const textInput = document.getElementById('broadcast-text');
    const imageInput = document.getElementById('broadcast-image');
    const linkInput = document.getElementById('broadcast-link');
    
    const previewTitle = document.getElementById('preview-title');
    const previewText = document.getElementById('preview-text');
    const previewImage = document.getElementById('preview-image');
    const previewImageContainer = document.getElementById('preview-image-container');
    const previewLink = document.getElementById('preview-link');
    
    // Live preview
    if (titleInput) {
        titleInput.addEventListener('input', function() {
            previewTitle.textContent = this.value || 'Заголовок появится здесь';
        });
    }
    
    if (textInput) {
        textInput.addEventListener('input', function() {
            previewText.textContent = this.value || 'Текст сообщения появится здесь';
        });
    }
    
    if (imageInput) {
        imageInput.addEventListener('input', function() {
            if (this.value) {
                previewImage.src = this.value;
                previewImageContainer.style.display = 'block';
            } else {
                previewImageContainer.style.display = 'none';
            }
        });
    }
    
    if (linkInput) {
        linkInput.addEventListener('input', function() {
            if (this.value) {
                previewLink.style.display = 'inline-block';
            } else {
                previewLink.style.display = 'none';
            }
        });
    }
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            vibrate();
            
            const broadcastData = {
                title: titleInput.value,
                text: textInput.value,
                image_url: imageInput.value || null,
                link_url: linkInput.value || null
            };
            
            try {
                await apiCall('/admin/broadcast', 'POST', broadcastData);
                showNotification('Рассылка успешно создана!', 3000);
                form.reset();
                previewTitle.textContent = 'Заголовок появится здесь';
                previewText.textContent = 'Текст сообщения появится здесь';
                previewImageContainer.style.display = 'none';
                previewLink.style.display = 'none';
                
                loadBroadcastsHistory();
            } catch (error) {
                showNotification('Ошибка при создании рассылки', 3000);
                console.error('Error creating broadcast:', error);
            }
        });
    }
}

async function loadBroadcastsHistory() {
    try {
        const result = await apiCall('/admin/broadcasts');
        const container = document.getElementById('broadcasts-history');
        
        if (!result.broadcasts || result.broadcasts.length === 0) {
            container.innerHTML = '<p class="no-data">Рассылок пока нет</p>';
            return;
        }
        
        container.innerHTML = result.broadcasts.map(broadcast => `
            <div class="history-card">
                ${broadcast.image_url ? `<img src="${broadcast.image_url}" alt="${broadcast.title}" class="history-image">` : ''}
                <div class="history-content">
                    <h4>${broadcast.title}</h4>
                    <p>${broadcast.text}</p>
                    <div class="history-meta">
                        <span>📅 ${formatDate(broadcast.created_at)}</span>
                        <span>👥 ${broadcast.sent_to_count} пользователей</span>
                        ${broadcast.link_url ? `<span>🔗 <a href="${broadcast.link_url}" target="_blank">Ссылка</a></span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading broadcasts:', error);
    }
}

// ===================================
// Initialization
// ===================================
function initializeMainApp() {
    loadThemePreference();
    loadLanguagePreference();
    setupNavigation();
    setupGameButtons();
    setupExchangeButtons();
    setupSettingsPanel();
    setupShareButton();
    loadUserData();
    loadLatestBroadcast();
    
    // Telegram Web App integration
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.ready();
    }
    
    // Fade in animation
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

function initializeAdminPanel() {
    const isAuthenticated = localStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_AUTH) === 'true';
    
    if (isAuthenticated) {
        showAdminDashboard();
    }
    
    setupAdminLogin();
    setupAdminNavigation();
    setupAdminLogout();
    setupBroadcastForm();
    
    // Fade in animation
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

// ===================================
// Entry Point
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    if (window.isAdminPanel) {
        initializeAdminPanel();
    } else {
        initializeMainApp();
    }
});
