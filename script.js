const BOT_USERNAME = 'khadron_bot';
let currentUserId = null;
const WORKER_URL = 'https://misty-poetry-f4b2.scarneb.workers.dev/';

const GAMES_DATA = [
    { id: 0, name: "Pixel World", fullLink: "https://t.me/pixelworld/play?startapp=r6823288584", description: "Первый 3D-шутер в Telegram", rating: 4.9, players: "34K", image: "images/photo_2026-02-17_13-44-55.jpg", fallback: "🌍", badge: "Beta", highlight: true },
    { id: 1, name: "Hamster GameDev", fullLink: "https://t.me/Hamster_GAme_Dev_bot/start?startapp=kentId6823288584", description: "Создай свою студию", rating: 4.7, players: "368K", image: "images/hamster-gamedev.jpg", fallback: "🎮" },
    { id: 2, name: "Hamster King", fullLink: "https://t.me/hamsterking_game_bot?startapp=6823288584", description: "Стань королем хомяков", rating: 4.2, players: "188K", image: "images/hamster-king.jpg", fallback: "👑" },
    { id: 3, name: "Hamster Fight Club", fullLink: "https://t.me/hamster_fightclub_bot?startapp=NWE1YjA2YWUtZTAyMS01ZjA1LTg4ZTYtMGZmZjUwNDQwNjU5", description: "Бойцовский клуб хомяков", rating: 4.9, players: "85K", image: "images/hamster-fightclub.jpg", fallback: "🥊" },
    { id: 4, name: "BitQuest", fullLink: "https://t.me/BitquestGameSBot/start?startapp=kentId_6823288584", description: "Приключения в мире крипты", rating: 3.8, players: "281K", image: "images/bitquest.jpg", fallback: "💰" }
];

const EXCHANGES_DATA = [
    { id: 1, name: "Bybit", url: "https://www.bybit.com/invite?ref=57KXPMO", description: "Продвинутая торговая платформа", image: "images/bybit.jpg", fallback: "💱" },
    { id: 2, name: "BingX", url: "https://bingxdao.com/referral-program/V2TZVA?activityId=g_1529293499868241925", description: "Социальная торговля", image: "images/bingx.jpg", fallback: "📈" },
    { id: 3, name: "Bitget", url: "https://www.bitgetapps.com/ru/referral/register?clacCode=40FSP70H", description: "Инновационная платформа", image: "images/bitget.jpg", fallback: "⚡" },
    { id: 4, name: "MEXC", url: "https://promote.mexc.com/r/aTSLfdm54W", description: "Низкие комиссии", image: "images/mexc.jpg", fallback: "🌍" }
];

const translations = {
    ru: {
        appTitle: "Games Verse", settings: "Настройки", theme: "Тема", lightTheme: "Светлая", darkTheme: "Темная",
        language: "Язык", russian: "Русский", english: "English", done: "Готово", games: "Игры",
        bestGames: "Лучшие игры Telegram", play: "Играть", exchanges: "Биржи", exchangesDesc: "Торгуйте безопасно",
        user: "Пользователь", shareWithFriends: "Поделиться", profile: "Профиль", linkCopied: "Ссылка скопирована!",
        go: "Перейти", blockBlast: "Block Blast", score: "Счёт", best: "Лучший", newGame: "Новая игра",
        blockHint: "👆 Перетащите блок на сетку"
    },
    en: {
        appTitle: "Games Verse", settings: "Settings", theme: "Theme", lightTheme: "Light", darkTheme: "Dark",
        language: "Language", russian: "Russian", english: "English", done: "Done", games: "Games",
        bestGames: "Best Telegram Games", play: "Play", exchanges: "Exchanges", exchangesDesc: "Trade safely",
        user: "User", shareWithFriends: "Share", profile: "Profile", linkCopied: "Link copied!",
        go: "Go", blockBlast: "Block Blast", score: "Score", best: "Best", newGame: "New Game",
        blockHint: "👆 Drag a block to the grid"
    }
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function vibrate() { if (navigator.vibrate) navigator.vibrate(50); }

function initializeApp() {
    initializeTelegramWebApp();
    setupNavigation();
    initializeGames();
    initializeExchanges();
    setupSettingsPanel();
    loadThemePreference();
    loadLanguagePreference();
    loadUserData();
    setupShareButton();
    setTimeout(() => document.body.style.opacity = '1', 100);
}

function initializeTelegramWebApp() {
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
    }
}

function initializeGames() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;
    grid.innerHTML = GAMES_DATA.map(game => `
        <div class="game-card ${game.highlight ? 'highlight' : ''}">
            <div class="game-image">
                <img src="${game.image}" class="game-img" onerror="this.style.display='none'">
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
                    <div class="players">
                        <span>👥</span> ${game.players}
                    </div>
                </div>
            </div>
            <button class="play-button" data-link="${game.fullLink}">${getTranslation('play')}</button>
        </div>
    `).join('');
    document.querySelectorAll('.play-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            vibrate();
            const link = btn.dataset.link;
            if (link) window.Telegram?.WebApp?.openTelegramLink(link) || window.open(link, '_blank');
        });
    });
}

function generateStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    let stars = '';
    for (let i=0; i<full; i++) stars += '<span class="star filled">★</span>';
    if (half) stars += '<span class="star half">★</span>';
    for (let i=0; i<empty; i++) stars += '<span class="star">★</span>';
    return stars;
}

function initializeExchanges() {
    const list = document.getElementById('exchanges-list');
    if (!list) return;
    list.innerHTML = EXCHANGES_DATA.map(ex => `
        <div class="exchange-card">
            <div class="exchange-logo">
                <img src="${ex.image}" class="exchange-img" onerror="this.style.display='none'">
                <div class="image-fallback">${ex.fallback}</div>
            </div>
            <div class="exchange-info">
                <h3>${ex.name}</h3>
                <p>${ex.description}</p>
            </div>
            <button class="exchange-button" data-url="${ex.url}">${getTranslation('go')}</button>
        </div>
    `).join('');
    document.querySelectorAll('.exchange-button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            vibrate();
            const url = this.dataset.url;
            if (url) window.Telegram?.WebApp?.openLink(url) || window.open(url, '_blank');
        });
    });
}

function loadUserData() {
    const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (user) {
        document.getElementById('user-name').textContent = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        document.getElementById('user-username').textContent = user.username ? '@'+user.username : 'Telegram User';
        const avatar = document.getElementById('avatar-img');
        if (user.photo_url) {
            avatar.src = user.photo_url;
            avatar.style.display = 'block';
            document.getElementById('avatar-fallback').style.display = 'none';
        }
        currentUserId = user.id;
        sendUserStat(user);
    }
}

async function sendUserStat(user) {
    if (!user?.id) return;
    const msg = `🆕 Новый пользователь\n👤 ${user.first_name} ${user.last_name}\n🆔 ${user.id}\n⭐ Premium: ${user.is_premium ? 'Да':'Нет'}`;
    await fetch(WORKER_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ message: msg, chatId: '6823288584' })
    }).catch(console.error);
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const header = document.querySelector('.header');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            vibrate();
            const targetId = this.dataset.section;
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            if (targetId === 'profile-section') header.style.display = 'none';
            else header.style.display = 'block';
        });
    });
}

function setupSettingsPanel() {
    document.getElementById('settings-button')?.addEventListener('click', () => {
        document.getElementById('settings-panel').classList.add('active');
    });
    document.getElementById('close-settings')?.addEventListener('click', () => {
        document.getElementById('settings-panel').classList.remove('active');
    });
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            if (this.dataset.theme === 'dark') document.body.classList.add('dark-theme');
            else document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', this.dataset.theme);
        });
    });
    document.querySelectorAll('.language-option').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.language-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            setLanguage(this.dataset.lang);
            localStorage.setItem('language', this.dataset.lang);
        });
    });
}

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = translations[lang]?.[key] || key;
    });
}

function getTranslation(key) {
    const lang = localStorage.getItem('language') || 'ru';
    return translations[lang]?.[key] || key;
}

function loadThemePreference() {
    const saved = localStorage.getItem('theme') || 'light';
    if (saved === 'dark') document.body.classList.add('dark-theme');
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === saved);
    });
}

function loadLanguagePreference() {
    const saved = localStorage.getItem('language') || 'ru';
    setLanguage(saved);
    document.querySelectorAll('.language-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === saved);
    });
}

function setupShareButton() {
    document.getElementById('share-friends-button')?.addEventListener('click', () => {
        const botUrl = `https://t.me/${BOT_USERNAME}?start=ref_${currentUserId || ''}`;
        const shareText = '🎮 Games Verse – лучшие мини-игры Telegram!';
        if (window.Telegram?.WebApp?.openTelegramLink) {
            window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(botUrl)}&text=${encodeURIComponent(shareText)}`);
        } else {
            navigator.clipboard?.writeText(botUrl).then(() => showNotification());
        }
    });
}

function showNotification(msg) {
    const el = document.getElementById('notification');
    if (!el) return;
    el.textContent = msg || getTranslation('linkCopied');
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2000);
}

// ==================== BLOCK BLAST GAME ====================
class BlockBlast {
    constructor(boardElement, blocksElement, scoreElement, bestScoreElement) {
        this.boardElement = boardElement;
        this.blocksElement = blocksElement;
        this.scoreElement = scoreElement;
        this.bestScoreElement = bestScoreElement;
        this.gridSize = 8;
        this.grid = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScoreBlockBlast')) || 0;
        this.blocks = [];
        this.selectedBlockIndex = null;
        this.dragging = null;
        this.ghost = null;
        this.init();
        this.bindEvents();
    }

    shapes = [
        [[0,0],[0,1],[0,2]], [[0,0],[1,0],[2,0],[2,1]], [[0,0],[0,1],[1,0],[1,1]],
        [[0,0],[0,1],[0,2],[1,1]], [[0,0],[0,1],[1,1],[1,2]], [[0,1],[0,2],[1,0],[1,1]],
        [[0,0],[0,1],[0,2],[0,3]], [[0,0],[1,0],[2,0],[2,1]],
        [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]], [[0,0],[0,1],[0,2],[0,3],[0,4]]
    ];
    colorCodes = ['#FF6B6B', '#4ECDC4', '#FFD93D'];

    init() {
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
        this.score = 0;
        this.updateScoreUI();
        this.blocks = this.generateBlocks(3);
        this.selectedBlockIndex = null;
        this.render();
    }

    generateBlocks(count) {
        const arr = [];
        for (let i = 0; i < count; i++) {
            const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
            arr.push({ shape: shape.map(c => [...c]), color: this.colorCodes[i % 3] });
        }
        return arr;
    }

    render() {
        this.renderBoard();
        this.renderBlocks();
    }

    renderBoard() {
        this.boardElement.innerHTML = '';
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                const cell = document.createElement('div');
                cell.className = 'board-cell';
                if (this.grid[r][c] === 1) {
                    cell.classList.add('filled');
                    const color = this.getCellColor(r, c);
                    if (color) cell.style.background = color;
                }
                cell.dataset.row = r;
                cell.dataset.col = c;
                this.boardElement.appendChild(cell);
            }
        }
    }

    // Храним цвета отдельно в двумерном массиве
    colorGrid = [];

    getCellColor(r, c) { return this.colorGrid[r]?.[c] || null; }
    setCellColor(r, c, color) {
        if (!this.colorGrid[r]) this.colorGrid[r] = [];
        this.colorGrid[r][c] = color;
    }

    renderBlocks() {
        this.blocksElement.innerHTML = '';
        this.blocks.forEach((block, idx) => {
            const bounds = this.getBounds(block.shape);
            const div = document.createElement('div');
            div.className = 'block-option';
            if (this.selectedBlockIndex === idx) div.classList.add('selected');
            div.style.gridTemplateColumns = `repeat(${bounds.cols}, 1fr)`;
            div.style.gridTemplateRows = `repeat(${bounds.rows}, 1fr)`;
            div.style.setProperty('--block-color', block.color);
            for (let r = 0; r < bounds.rows; r++) {
                for (let c = 0; c < bounds.cols; c++) {
                    const cell = document.createElement('div');
                    cell.className = 'block-preview-cell';
                    const filled = block.shape.some(cell => cell[0] === bounds.minR + r && cell[1] === bounds.minC + c);
                    if (filled) cell.classList.add('filled');
                    div.appendChild(cell);
                }
            }
            div.addEventListener('touchstart', (e) => this.onDragStart(e, idx));
            div.addEventListener('mousedown', (e) => this.onDragStart(e, idx));
            div.addEventListener('click', (e) => {
                if (!this._dragMoved) this.selectBlock(idx);
                this._dragMoved = false;
            });
            this.blocksElement.appendChild(div);
        });
    }

    getBounds(shape) {
        let minR = 99, maxR = -99, minC = 99, maxC = -99;
        shape.forEach(c => { minR = Math.min(minR, c[0]); maxR = Math.max(maxR, c[0]); minC = Math.min(minC, c[1]); maxC = Math.max(maxC, c[1]); });
        return { minR, maxR, minC, maxC, rows: maxR-minR+1, cols: maxC-minC+1 };
    }

    selectBlock(idx) {
        this.selectedBlockIndex = this.selectedBlockIndex === idx ? null : idx;
        this.renderBlocks();
    }

    onDragStart(e, idx) {
        if (e.type === 'touchstart') {
            const touch = e.touches[0];
            this._dragStartX = touch.clientX;
            this._dragStartY = touch.clientY;
            document.addEventListener('touchmove', this.onTouchMove);
            document.addEventListener('touchend', this.onTouchEnd);
        } else {
            this._dragStartX = e.clientX;
            this._dragStartY = e.clientY;
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
        }
        this.dragging = idx;
        this._dragMoved = false;
        this.ghost = this.createGhost(idx);
        document.body.appendChild(this.ghost);
        this.updateGhostPosition(e.touches ? e.touches[0].clientX : e.clientX, e.touches ? e.touches[0].clientY : e.clientY);
        e.preventDefault();
    }

    createGhost(idx) {
        const block = this.blocks[idx];
        const bounds = this.getBounds(block.shape);
        const ghost = document.createElement('div');
        ghost.className = 'drag-ghost';
        ghost.style.gridTemplateColumns = `repeat(${bounds.cols}, 1fr)`;
        ghost.style.gridTemplateRows = `repeat(${bounds.rows}, 1fr)`;
        ghost.style.setProperty('--block-color', block.color);
        for (let r = 0; r < bounds.rows; r++) {
            for (let c = 0; c < bounds.cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'block-preview-cell';
                if (block.shape.some(s => s[0] === bounds.minR + r && s[1] === bounds.minC + c)) cell.classList.add('filled');
                ghost.appendChild(cell);
            }
        }
        return ghost;
    }

    updateGhostPosition(x, y) {
        if (!this.ghost) return;
        this.ghost.style.left = x + 'px';
        this.ghost.style.top = y + 'px';
        this.showBoardPreview(x, y);
    }

    showBoardPreview(x, y) {
        this.clearBoardPreview();
        const boardRect = this.boardElement.getBoundingClientRect();
        if (x < boardRect.left || x > boardRect.right || y < boardRect.top || y > boardRect.bottom) return;
        const cellSize = boardRect.width / this.gridSize;
        const col = Math.floor((x - boardRect.left) / cellSize);
        const row = Math.floor((y - boardRect.top) / cellSize);
        const block = this.blocks[this.dragging];
        if (!block) return;
        const bounds = this.getBounds(block.shape);
        const offsetR = row - bounds.minR;
        const offsetC = col - bounds.minC;
        const valid = this.canPlace(block.shape, offsetR, offsetC);
        block.shape.forEach(([r, c]) => {
            const nr = r + offsetR, nc = c + offsetC;
            if (nr>=0 && nr<this.gridSize && nc>=0 && nc<this.gridSize) {
                const cell = this.boardElement.querySelector(`.board-cell[data-row='${nr}'][data-col='${nc}']`);
                if (cell) cell.classList.add(valid ? 'highlight-valid' : 'invalid-ghost');
            }
        });
    }

    clearBoardPreview() {
        this.boardElement.querySelectorAll('.board-cell.highlight-valid, .board-cell.invalid-ghost').forEach(c => {
            c.classList.remove('highlight-valid', 'invalid-ghost');
        });
    }

    canPlace(shape, offsetR, offsetC) {
        return shape.every(([r,c]) => {
            const nr = r+offsetR, nc = c+offsetC;
            return nr>=0 && nr<this.gridSize && nc>=0 && nc<this.gridSize && this.grid[nr][nc] === 0;
        });
    }

    finishDrag(commit) {
        if (!this.ghost) return;
        this.clearBoardPreview();
        document.body.removeChild(this.ghost);
        this.ghost = null;
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        if (commit && this.dragging !== null) {
            const x = this._lastX || this._dragStartX;
            const y = this._lastY || this._dragStartY;
            const boardRect = this.boardElement.getBoundingClientRect();
            const cellSize = boardRect.width / this.gridSize;
            const col = Math.floor((x - boardRect.left) / cellSize);
            const row = Math.floor((y - boardRect.top) / cellSize);
            const block = this.blocks[this.dragging];
            const bounds = this.getBounds(block.shape);
            const offsetR = row - bounds.minR;
            const offsetC = col - bounds.minC;
            if (this.canPlace(block.shape, offsetR, offsetC)) {
                this.placeBlock(block.shape, offsetR, offsetC, this.dragging);
                this.dragging = null;
                this.render();
            }
        }
        this.dragging = null;
    }

    onTouchMove = (e) => {
        e.preventDefault();
        const t = e.touches[0];
        this._lastX = t.clientX;
        this._lastY = t.clientY;
        this._dragMoved = true;
        this.updateGhostPosition(t.clientX, t.clientY);
    };
    onTouchEnd = () => this.finishDrag(true);
    onMouseMove = (e) => {
        this._lastX = e.clientX;
        this._lastY = e.clientY;
        this._dragMoved = true;
        this.updateGhostPosition(e.clientX, e.clientY);
    };
    onMouseUp = () => this.finishDrag(true);

    placeBlock(shape, offsetR, offsetC, blockIndex) {
        const color = this.blocks[blockIndex].color;
        shape.forEach(([r,c]) => {
            const nr = r+offsetR, nc = c+offsetC;
            this.grid[nr][nc] = 1;
            this.setCellColor(nr, nc, color);
        });
        this.blocks.splice(blockIndex, 1);
        while (this.blocks.length < 3) {
            const newShape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
            this.blocks.push({ shape: newShape.map(c => [...c]), color: this.colorCodes[Math.floor(Math.random()*3)] });
        }
        this.clearFullLines();
    }

    clearFullLines() {
        let cleared = 0;
        for (let r = 0; r < this.gridSize; r++) {
            if (this.grid[r].every(v => v === 1)) {
                for (let c = 0; c < this.gridSize; c++) this.grid[r][c] = 0;
                cleared++;
            }
        }
        for (let c = 0; c < this.gridSize; c++) {
            let full = true;
            for (let r = 0; r < this.gridSize; r++) if (this.grid[r][c] !== 1) { full = false; break; }
            if (full) {
                for (let r = 0; r < this.gridSize; r++) this.grid[r][c] = 0;
                cleared++;
            }
        }
        if (cleared > 0) {
            this.score += cleared * 10;
            this.updateScoreUI();
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('bestScoreBlockBlast', this.bestScore);
            }
            this.showCombo(cleared);
        }
    }

    showCombo(lines) {
        const pop = document.createElement('div');
        pop.className = 'combo-pop';
        pop.textContent = `+${lines} lines!`;
        this.boardElement.appendChild(pop);
        setTimeout(() => pop.remove(), 800);
    }

    updateScoreUI() {
        this.scoreElement.textContent = this.score;
        this.bestScoreElement.textContent = this.bestScore;
    }

    checkGameOver() {
        for (const block of this.blocks) {
            const bounds = this.getBounds(block.shape);
            for (let r = 0; r < this.gridSize; r++) {
                for (let c = 0; c < this.gridSize; c++) {
                    if (this.canPlace(block.shape, r - bounds.minR, c - bounds.minC)) return false;
                }
            }
        }
        return true;
    }

    resetGame() {
        this.init();
    }

    bindEvents() {
        this.boardElement.addEventListener('touchstart', e => e.preventDefault());
    }
}

let blockBlast;
function initBlockBlast() {
    const board = document.getElementById('block-blast-board');
    const blocks = document.getElementById('block-blast-blocks');
    const score = document.getElementById('block-score');
    const best = document.getElementById('block-best-score');
    if (board && blocks && score && best) {
        blockBlast = new BlockBlast(board, blocks, score, best);
        document.getElementById('new-game-btn')?.addEventListener('click', () => { vibrate(); blockBlast.resetGame(); });
    }
}
setTimeout(initBlockBlast, 300);
