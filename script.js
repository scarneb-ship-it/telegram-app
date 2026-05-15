// ==================== КОНФИГУРАЦИЯ ====================
const BOT_USERNAME = 'khadron_bot';
const WORKER_URL = 'https://misty-poetry-f4b2.scarneb.workers.dev/';
let currentUserId = null;
let userStatSent = false; // Отправляем статистику только раз за сессию

// Данные
const GAMES_DATA = [
    { id:0, name:"Pixel World", fullLink:"https://t.me/pixelworld/play?startapp=r6823288584", description:"Первый 3D-шутер в Telegram", rating:4.9, players:"34K", image:"images/photo_2026-02-17_13-44-55.jpg", fallback:"🌍", badge:"Beta", highlight:true },
    { id:1, name:"Hamster GameDev", fullLink:"https://t.me/Hamster_GAme_Dev_bot/start?startapp=kentId6823288584", description:"Создай свою студию", rating:4.7, players:"368K", image:"images/hamster-gamedev.jpg", fallback:"🎮" },
    { id:2, name:"Hamster King", fullLink:"https://t.me/hamsterking_game_bot?startapp=6823288584", description:"Стань королем хомяков", rating:4.2, players:"188K", image:"images/hamster-king.jpg", fallback:"👑" },
    { id:3, name:"Hamster Fight Club", fullLink:"https://t.me/hamster_fightclub_bot?startapp=NWE1YjA2YWUtZTAyMS01ZjA1LTg4ZTYtMGZmZjUwNDQwNjU5", description:"Бойцовский клуб хомяков", rating:4.9, players:"85K", image:"images/hamster-fightclub.jpg", fallback:"🥊" },
    { id:4, name:"BitQuest", fullLink:"https://t.me/BitquestGameSBot/start?startapp=kentId_6823288584", description:"Приключения в мире крипты", rating:3.8, players:"281K", image:"images/bitquest.jpg", fallback:"💰" }
];
const EXCHANGES_DATA = [
    { id:1, name:"Bybit", url:"https://www.bybit.com/invite?ref=57KXPMO", description:"Продвинутая торговая платформа", image:"images/bybit.jpg", fallback:"💱" },
    { id:2, name:"BingX", url:"https://bingxdao.com/referral-program/V2TZVA?activityId=g_1529293499868241925", description:"Социальная торговля и копирование", image:"images/bingx.jpg", fallback:"📈" },
    { id:3, name:"Bitget", url:"https://www.bitgetapps.com/ru/referral/register?clacCode=40FSP70H&from=%2Fru%2Fevents%2Freferral-all-program&source=events&utmSource=PremierInviter", description:"Инновационная торговая платформа", image:"images/bitget.jpg", fallback:"⚡" },
    { id:4, name:"MEXC", url:"https://promote.mexc.com/r/aTSLfdm54W", description:"Глобальная биржа с низкими комиссиями", image:"images/mexc.jpg", fallback:"🌍" }
];

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    initTelegram();
    setupNavigation();
    renderGames();
    renderExchanges();
    initSettings();
    loadTheme();
    loadUserProfile();
    setupShareButton();
    setupBuyStarsButton();
    setupChatButton();
    initGame2048Lazy();
}

// Вибрация
function vibrate() {
    if (navigator.vibrate) navigator.vibrate(30);
}

// Telegram WebApp
function initTelegram() {
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        // Применяем цвета темы Telegram (опционально)
        const tp = tg.themeParams;
        if (tp) {
            document.documentElement.style.setProperty('--tg-bg', tp.bg_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-text', tp.text_color || '#000000');
        }
    }
}

// ==================== НАВИГАЦИЯ ====================
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const header = document.getElementById('main-header');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            vibrate();
            const targetId = item.dataset.section;
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            sections.forEach(s => s.classList.remove('active'));
            const target = document.getElementById(targetId);
            if (target) target.classList.add('active');

            // Показывать/скрывать хедер для некоторых разделов
            if (header) {
                header.style.display = (targetId === 'profile-section' || targetId === 'game2048-section') ? 'none' : 'block';
            }

            // Если открыли 2048 – инициализируем игру при необходимости
            if (targetId === 'game2048-section') {
                initGame2048Lazy();
            }
        });
    });

    // Активный раздел по умолчанию
    const active = document.querySelector('.content-section.active');
    if (active && header) {
        const id = active.id;
        if (id === 'profile-section' || id === 'game2048-section') header.style.display = 'none';
    }
}

// ==================== ОТРИСОВКА КАРТОЧЕК ====================
function renderGames() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;
    grid.innerHTML = GAMES_DATA.map(game => `
        <div class="game-card ${game.highlight ? 'highlight' : ''}">
            <div class="game-image">
                <img src="${game.image}" alt="${game.name}" class="game-img" loading="lazy" onerror="this.style.display='none'">
                <div class="image-fallback">${game.fallback}</div>
            </div>
            <div class="game-info">
                <div class="game-header">
                    <h3>${game.name}</h3>
                    ${game.badge ? `<span class="game-badge">${game.badge}</span>` : ''}
                </div>
                <p class="game-description">${game.description}</p>
                <div class="game-stats">
                    <div class="rating">
                        <div class="stars">${generateStars(game.rating)}</div>
                        <span class="rating-value">${game.rating}</span>
                    </div>
                    <div class="players">👥 ${game.players}</div>
                </div>
            </div>
            <button class="play-button" data-link="${game.fullLink}">Играть</button>
        </div>
    `).join('');

    document.querySelectorAll('.play-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            vibrate();
            const link = btn.dataset.link;
            if (link) openTelegramLink(link);
        });
    });
}

function generateStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return '★'.repeat(full) + (half ? '<span class="star half">★</span>' : '') + '★'.repeat(empty).replace(/★/g, '<span class="star">★</span>');
}

function renderExchanges() {
    const list = document.getElementById('exchanges-list');
    if (!list) return;
    list.innerHTML = EXCHANGES_DATA.map(ex => `
        <div class="exchange-card">
            <div class="exchange-logo">
                <img src="${ex.image}" alt="${ex.name}" class="exchange-img" loading="lazy" onerror="this.style.display='none'">
                <div class="image-fallback">${ex.fallback}</div>
            </div>
            <div class="exchange-info">
                <h3>${ex.name}</h3>
                <p>${ex.description}</p>
            </div>
            <button class="exchange-button" data-url="${ex.url}">Перейти</button>
        </div>
    `).join('');

    document.querySelectorAll('.exchange-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            vibrate();
            const url = btn.dataset.url;
            if (url) openExternalLink(url);
        });
    });
}

// ==================== НАСТРОЙКИ ====================
function initSettings() {
    const panel = document.getElementById('settings-panel');
    const openBtn = document.getElementById('settings-button');
    const closeBtn = document.getElementById('close-settings');
    const closeIcon = document.getElementById('close-settings-icon');

    openBtn?.addEventListener('click', () => {
        vibrate();
        panel.classList.add('active');
    });

    const closePanel = () => {
        vibrate();
        panel.classList.remove('active');
    };
    closeBtn?.addEventListener('click', closePanel);
    closeIcon?.addEventListener('click', closePanel);
    panel?.addEventListener('click', (e) => {
        if (e.target === panel) closePanel();
    });

    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.addEventListener('click', () => {
            vibrate();
            const theme = opt.dataset.theme;
            document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            document.body.classList.toggle('dark-theme', theme === 'dark');
            localStorage.setItem('theme', theme);
        });
    });
}

function loadTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', saved === 'dark');
    document.querySelectorAll('.theme-option').forEach(o => {
        o.classList.toggle('active', o.dataset.theme === saved);
    });
}

// ==================== ПРОФИЛЬ ====================
function loadUserProfile() {
    if (window.Telegram?.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe?.user;
        if (user) {
            currentUserId = user.id;
            updateProfileUI(user);
            if (!userStatSent) {
                sendUserStat(user);
                userStatSent = true;
            }
            return;
        }
    }
    // Фолбэк
    document.getElementById('user-name').textContent = 'Пользователь';
    document.getElementById('user-username').textContent = 'Открой в Telegram';
}

function updateProfileUI(user) {
    const nameEl = document.getElementById('user-name');
    const usernameEl = document.getElementById('user-username');
    const avatarImg = document.getElementById('avatar-img');
    const fallback = document.getElementById('avatar-fallback');

    nameEl.textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    usernameEl.textContent = user.username ? '@' + user.username : 'Telegram User';

    if (user.photo_url) {
        avatarImg.src = user.photo_url;
        avatarImg.style.display = 'block';
        avatarImg.onerror = () => {
            avatarImg.style.display = 'none';
            showAvatarFallback(user, fallback);
        };
        fallback.style.display = 'none';
    } else {
        avatarImg.style.display = 'none';
        showAvatarFallback(user, fallback);
    }

    if (user.is_premium) {
        const container = document.querySelector('.profile-info');
        if (container && !document.querySelector('.premium-badge')) {
            const badge = document.createElement('span');
            badge.className = 'premium-badge';
            badge.textContent = '⭐ Premium';
            container.appendChild(badge);
        }
    }
}

function showAvatarFallback(user, fallbackEl) {
    fallbackEl.textContent = user.first_name ? user.first_name.charAt(0).toUpperCase() : 'T';
    fallbackEl.style.display = 'flex';
}

async function sendUserStat(user) {
    if (!user?.id) return;
    const message = `🆕 Новый пользователь\n👤 ${user.first_name || ''} ${user.last_name || ''}\n🆔 ${user.id}\n🧑‍💻 ${user.username ? '@'+user.username : 'нет'}\n⭐ Premium: ${user.is_premium ? 'Да' : 'Нет'}\n📅 ${new Date().toLocaleString('ru-RU')}`;
    try {
        await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, chatId: '6823288584' })
        });
    } catch (e) { /* тихо */ }
}

// ==================== КНОПКИ ПРОФИЛЯ ====================
function setupShareButton() {
    document.getElementById('share-friends-button')?.addEventListener('click', () => {
        vibrate();
        const ref = currentUserId ? `ref_${currentUserId}` : '';
        const url = `https://t.me/${BOT_USERNAME}${ref ? '?start='+ref : ''}`;
        const shareText = '🎮 Играй в лучшие мини-игры Telegram с HADRON!';
        if (window.Telegram?.WebApp) {
            const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
            window.Telegram.WebApp.openTelegramLink(shareUrl);
        } else {
            if (navigator.share) {
                navigator.share({ title: 'Games Verse', text: shareText, url }).catch(() => copyToClipboard(url));
            } else {
                copyToClipboard(url);
            }
        }
    });
}

function setupBuyStarsButton() {
    document.getElementById('buy-stars-button')?.addEventListener('click', () => {
        vibrate();
        openTelegramLink('https://t.me/StarsShipBot?start=r6823288584');
    });
}

function setupChatButton() {
    document.getElementById('chat-button')?.addEventListener('click', () => {
        vibrate();
        openTelegramLink('https://t.me/hadron_chat');
    });
}

function copyToClipboard(text) {
    navigator.clipboard?.writeText(text).then(showNotification).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showNotification();
    });
}

function showNotification(msg = 'Ссылка скопирована!') {
    const el = document.getElementById('notification');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2000);
}

function openTelegramLink(link) {
    if (window.Telegram?.WebApp) {
        if (link.startsWith('https://t.me/')) window.Telegram.WebApp.openTelegramLink(link);
        else window.Telegram.WebApp.openLink(link);
    } else {
        window.open(link, '_blank');
    }
}

function openExternalLink(url) {
    if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(url);
    else window.open(url, '_blank');
}

// ==================== ИГРА 2048 ====================
class Game2048 {
    constructor(boardEl, scoreEl, bestEl, statusEl) {
        this.board = boardEl;
        this.scoreEl = scoreEl;
        this.bestEl = bestEl;
        this.statusEl = statusEl;
        this.size = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('best2048') || '0', 10);
        this.animations = [];        // [{fromRow, fromCol, toRow, toCol, merged}]
        this.lastAdded = null;
        this.win = false;
        this.gameOver = false;
        this.init();
        this.bindEvents();
    }

    init() {
        this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        this.score = 0;
        this.updateScore();
        this.statusEl.textContent = '';
        this.animations = [];
        this.lastAdded = null;
        this.win = false;
        this.gameOver = false;
        this.addRandomTile();
        this.addRandomTile();
        this.render();
    }

    addRandomTile() {
        const empty = [];
        for (let r = 0; r < this.size; r++)
            for (let c = 0; c < this.size; c++)
                if (this.grid[r][c] === 0) empty.push({r, c});
        if (empty.length === 0) return false;
        const {r, c} = empty[Math.floor(Math.random() * empty.length)];
        this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        this.lastAdded = {r, c};
        return true;
    }

    move(direction) {
        if (this.gameOver) return;
        const oldGrid = JSON.parse(JSON.stringify(this.grid));
        let moved = false;
        let scoreGain = 0;
        this.animations = [];

        const slide = (line, reverse) => {
            let arr = line.filter(v => v !== 0);
            if (reverse) arr.reverse();
            const newArr = [];
            let merged = new Array(arr.length).fill(false);
            for (let i = 0; i < arr.length; i++) {
                if (i < arr.length - 1 && arr[i] === arr[i+1] && !merged[i] && !merged[i+1]) {
                    newArr.push(arr[i] * 2);
                    scoreGain += arr[i] * 2;
                    merged[i] = merged[i+1] = true;
                    i++;
                } else {
                    newArr.push(arr[i]);
                }
            }
            while (newArr.length < this.size) newArr.push(0);
            if (reverse) newArr.reverse();
            return newArr;
        };

        // Обработка строк/столбцов
        if (direction === 'left' || direction === 'right') {
            const rev = direction === 'right';
            for (let r = 0; r < this.size; r++) {
                const oldRow = [...this.grid[r]];
                const newRow = slide(oldRow, rev);
                if (JSON.stringify(oldRow) !== JSON.stringify(newRow)) moved = true;
                this.grid[r] = newRow;
            }
        } else {
            const rev = direction === 'down';
            for (let c = 0; c < this.size; c++) {
                const oldCol = [];
                for (let r = 0; r < this.size; r++) oldCol.push(this.grid[r][c]);
                const newCol = slide(oldCol, rev);
                if (JSON.stringify(oldCol) !== JSON.stringify(newCol)) moved = true;
                for (let r = 0; r < this.size; r++) this.grid[r][c] = newCol[r];
            }
        }

        if (!moved) return;

        // Подготовка анимаций: сравниваем старую и новую сетки
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] !== 0 && oldGrid[r][c] !== this.grid[r][c]) {
                    // Ищем, откуда пришла плитка
                    let fromR = -1, fromC = -1;
                    let merged = false;
                    // Проверяем, не результат ли слияния
                    const val = this.grid[r][c];
                    if (val > 0) {
                        // Сканируем соседние клетки в направлении, обратном движению
                        const dirs = {
                            left: [0, -1],
                            right: [0, 1],
                            up: [-1, 0],
                            down: [1, 0]
                        };
                        const [dr, dc] = dirs[direction];
                        // Ищем исходную плитку с таким же значением (или половиной для слияния)
                        let found = false;
                        for (let step = 1; step < this.size; step++) {
                            const nr = r - dr * step;
                            const nc = c - dc * step;
                            if (nr < 0 || nr >= this.size || nc < 0 || nc >= this.size) break;
                            if (oldGrid[nr][nc] === val) {
                                fromR = nr; fromC = nc;
                                found = true;
                                break;
                            }
                            if (oldGrid[nr][nc] !== 0) break; // упёрлись в другую плитку
                        }
                        if (!found) {
                            // Возможно, это слияние – тогда ищем две одинаковые плитки
                            for (let step = 1; step < this.size; step++) {
                                const nr = r - dr * step;
                                const nc = c - dc * step;
                                if (nr < 0 || nr >= this.size || nc < 0 || nc >= this.size) break;
                                if (oldGrid[nr][nc] === val / 2) {
                                    // Проверим, есть ли рядом вторая такая же
                                    const nnr = nr - dr;
                                    const nnc = nc - dc;
                                    if (nnr >= 0 && nnr < this.size && nnc >= 0 && nnc < this.size && oldGrid[nnr][nnc] === val / 2) {
                                        fromR = nr; fromC = nc;
                                        merged = true;
                                        found = true;
                                        break;
                                    }
                                }
                                if (oldGrid[nr][nc] !== 0) break;
                            }
                        }
                        if (found) {
                            this.animations.push({ fromR, fromC, toR: r, toC: c, merged });
                        }
                    }
                }
            }
        }

        if (scoreGain > 0) {
            this.score += scoreGain;
            this.updateScore();
        }
        this.addRandomTile();
        this.render();
        this.checkGameState();
    }

    checkGameState() {
        if (this.grid.some(row => row.includes(2048)) && !this.win) {
            this.statusEl.textContent = 'Победа! 🎉';
            this.win = true;
        }
        if (this.isGameOver()) {
            this.statusEl.textContent = 'Игра окончена';
            this.gameOver = true;
        }
    }

    isGameOver() {
        for (let r = 0; r < this.size; r++)
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] === 0) return false;
                if (c < this.size-1 && this.grid[r][c] === this.grid[r][c+1]) return false;
                if (r < this.size-1 && this.grid[r][c] === this.grid[r+1][c]) return false;
            }
        return true;
    }

    updateScore() {
        this.scoreEl.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('best2048', this.bestScore);
            this.bestEl.textContent = this.bestScore;
        }
    }

    render() {
        const board = this.board;
        board.innerHTML = '';
        const gap = 8;
        const padding = 8;
        const boardWidth = board.clientWidth;
        const tileSize = (boardWidth - padding * 2 - gap * (this.size - 1)) / this.size;

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const value = this.grid[r][c];
                const tile = document.createElement('div');
                tile.className = 'tile-cell';
                if (value !== 0) {
                    tile.classList.add(`tile-${value <= 2048 ? value : 'super'}`);
                    tile.textContent = value;

                    // Анимация появления
                    if (this.lastAdded && this.lastAdded.r === r && this.lastAdded.c === c) {
                        tile.classList.add('tile-new');
                    }

                    // Анимации перемещения и слияния
                    const anim = this.animations.find(a => a.toR === r && a.toC === c);
                    if (anim) {
                        const deltaX = (anim.fromC - c) * (tileSize + gap);
                        const deltaY = (anim.fromR - r) * (tileSize + gap);
                        tile.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                        tile.offsetHeight; // форсируем reflow
                        tile.style.transition = 'transform 0.12s ease-in-out';
                        tile.style.transform = '';
                        if (anim.merged) {
                            tile.classList.add('tile-merge');
                        }
                    }
                }
                board.appendChild(tile);
            }
        }
        // Сброс анимаций
        this.lastAdded = null;
        this.animations = [];
    }

    bindEvents() {
        // Свайпы
        let startX = 0, startY = 0;
        this.board.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            e.preventDefault();
        }, { passive: false });
        this.board.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - startX;
            const dy = e.changedTouches[0].clientY - startY;
            if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
            if (Math.abs(dx) > Math.abs(dy)) {
                this.move(dx > 0 ? 'right' : 'left');
            } else {
                this.move(dy > 0 ? 'down' : 'up');
            }
            vibrate();
        });

        // Клавиатура
        window.addEventListener('keydown', (e) => {
            if (!document.getElementById('game2048-section')?.classList.contains('active')) return;
            const keyMap = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' };
            if (keyMap[e.key]) {
                e.preventDefault();
                this.move(keyMap[e.key]);
                vibrate();
            }
        });

        // Ресайз
        window.addEventListener('resize', () => {
            if (document.getElementById('game2048-section')?.classList.contains('active')) {
                this.render();
            }
        });
    }

    reset() {
        this.init();
    }
}

let game2048Instance = null;
function initGame2048Lazy() {
    if (game2048Instance) return;
    const board = document.getElementById('game-board-2048');
    const score = document.getElementById('game-score');
    const best = document.getElementById('best-score');
    const status = document.getElementById('game-status');
    if (board && score && best && status) {
        game2048Instance = new Game2048(board, score, best, status);
        document.getElementById('new-game-btn')?.addEventListener('click', () => {
            vibrate();
            game2048Instance.reset();
        });
    }
}

// ==================== ЗАПУСК ====================
// Инициализация игры при первом открытии вкладки
const observer = new MutationObserver(() => {
    const section = document.getElementById('game2048-section');
    if (section?.classList.contains('active')) {
        initGame2048Lazy();
    }
});
observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
