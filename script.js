document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupGameButtons();
    setupExchangeButtons();
    setupSettingsPanel();
    loadThemePreference();
    setupInviteButton();
    loadUserData();
    updateProfileStats();
    
    // Telegram Web App integration
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.expand();
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
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
            settingsPanel.classList.add('active');
        });
    }
    
    if (closeSettings) {
        closeSettings.addEventListener('click', function() {
            settingsPanel.classList.remove('active');
        });
    }
    
    // Close settings when clicking outside
    settingsPanel.addEventListener('click', function(e) {
        if (e.target === settingsPanel) {
            settingsPanel.classList.remove('active');
        }
    });
    
    // Theme switcher
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
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
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.querySelector('.theme-option[data-theme="dark"]').classList.add('active');
        document.querySelector('.theme-option[data-theme="light"]').classList.remove('active');
    }
}

function setupInviteButton() {
    const inviteButton = document.getElementById('invite-friends-button');
    
    if (inviteButton) {
        inviteButton.addEventListener('click', function() {
            // Track friend invitation
            trackFriendInvitation();
            
            const shareUrl = window.location.href;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Games Verse',
                    text: 'Открой для себя лучшие игры Telegram в одном приложении! Присоединяйся сейчас!',
                    url: shareUrl,
                });
            } else {
                navigator.clipboard.writeText(shareUrl).then(() => {
                    showNotification('Ссылка скопирована!');
                });
            }
        });
    }
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
                avatarFallback.textContent = user.first_name.charAt(0).toUpperCase();
            }
        }
    }
}

function updateProfileStats() {
    // Load stats from localStorage or initialize with defaults
    const stats = {
        gamesOpened: parseInt(localStorage.getItem('gamesOpened')) || 12,
        streakDays: parseInt(localStorage.getItem('streakDays')) || 7,
        friendsInvited: parseInt(localStorage.getItem('friendsInvited')) || 3,
        totalPoints: parseInt(localStorage.getItem('totalPoints')) || 1250,
        lastVisit: localStorage.getItem('lastVisit') || null
    };
    
    // Update streak
    updateStreak(stats);
    
    // Update UI
    document.getElementById('games-opened').textContent = stats.gamesOpened;
    document.getElementById('streak-days').textContent = stats.streakDays;
    document.getElementById('friends-invited').textContent = stats.friendsInvited;
    document.getElementById('total-points').textContent = stats.totalPoints.toLocaleString();
    document.querySelector('.achievement-progress').textContent = `${stats.friendsInvited}/10`;
    
    // Save stats
    localStorage.setItem('gamesOpened', stats.gamesOpened);
    localStorage.setItem('streakDays', stats.streakDays);
    localStorage.setItem('friendsInvited', stats.friendsInvited);
    localStorage.setItem('totalPoints', stats.totalPoints);
    localStorage.setItem('lastVisit', stats.lastVisit);
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
    }
    
    stats.lastVisit = today;
}

function trackGameOpening() {
    const stats = {
        gamesOpened: parseInt(localStorage.getItem('gamesOpened')) || 12,
        totalPoints: parseInt(localStorage.getItem('totalPoints')) || 1250
    };
    
    stats.gamesOpened += 1;
    stats.totalPoints += 10; // 10 points per game opened
    
    document.getElementById('games-opened').textContent = stats.gamesOpened;
    document.getElementById('total-points').textContent = stats.totalPoints.toLocaleString();
    
    localStorage.setItem('gamesOpened', stats.gamesOpened);
    localStorage.setItem('totalPoints', stats.totalPoints);
}

function trackFriendInvitation() {
    const stats = {
        friendsInvited: parseInt(localStorage.getItem('friendsInvited')) || 3,
        totalPoints: parseInt(localStorage.getItem('totalPoints')) || 1250
    };
    
    stats.friendsInvited += 1;
    stats.totalPoints += 50; // 50 points per friend invited
    
    // Bonus for every 5 friends
    if (stats.friendsInvited % 5 === 0) {
        stats.totalPoints += 500;
    }
    
    document.getElementById('friends-invited').textContent = stats.friendsInvited;
    document.getElementById('total-points').textContent = stats.totalPoints.toLocaleString();
    document.querySelector('.achievement-progress').textContent = `${stats.friendsInvited}/10`;
    
    localStorage.setItem('friendsInvited', stats.friendsInvited);
    localStorage.setItem('totalPoints', stats.totalPoints);
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}
