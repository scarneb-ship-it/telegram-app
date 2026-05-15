/* ============================================================
   Games Verse — script.js (улучшенная версия)
   ============================================================ */

'use strict';

// ==================== КОНФИГУРАЦИЯ ====================
const BOT_USERNAME = 'khadron_bot';
const WORKER_URL = 'https://misty-poetry-f4b2.scarneb.workers.dev/';

let currentUserId = null;

const GAMES_DATA = [
    {
        id: 0,
        name: "Pixel World",
        fullLink: "https://t.me/pixelworld/play?startapp=r6823288584",
        description: "Первый 3D-шутер в Telegram",
        rating: 4.9,
        players: "34K",
        image: "images/photo_2026-02-17_13-44-55.jpg",
        fallback: "🌍",
        badge: "Beta",
        highlight: true
    },
    {
        id: 1,
        name: "Hamster GameDev",
        fullLink: "https://t.me/Hamster_GAme_Dev_bot/start?startapp=kentId6823288584",
        description: "Создай свою студию",
        rating: 4.7,
        players: "368K",
        image: "images/hamster-gamedev.jpg",
        fallback: "🎮"
    },
    {
        id: 2,
        name: "Hamster King",
        fullLink: "https://t.me/hamsterking_game_bot?startapp=6823288584",
        description: "Стань королём хомяков",
        rating: 4.2,
        players: "188K",
        image: "images/hamster-king.jpg",
        fallback: "👑"
    },
    {
        id: 3,
        name: "Hamster Fight Club",
        fullLink: "https://t.me/hamster_fightclub_bot?startapp=NWE1YjA2YWUtZTAyMS01ZjA1LTg4ZTYtMGZmZjUwNDQwNjU5",
        description: "Бойцовский клуб хомяков",
        rating: 4.9,
        players: "85K",
        image: "images/hamster-fightclub.jpg",
        fallback: "🥊"
    },
    {
        id: 4,
        name: "BitQuest",
        fullLink: "https://t.me/BitquestGameSBot/start?startapp=kentId_6823288584",
        description: "Приключения в мире крипты",
        rating: 3.8,
        players: "281K",
        image: "images/bitquest.jpg",
        fallback: "💰"
    }
];

const EXCHANGES_DATA = [
    {
        id: 1,
        name: "Bybit",
        url: "https://www.bybit.com/invite?ref=57KXPMO",
        description: "Продвинутая торговая платформа",
        image: "images/bybit.jpg",
        fallback: "💱"
    },
    {
        id: 2,
        name: "BingX",
        url: "https://bingxdao.com/referral-program/V2TZVA?activityId=g_1529293499868241925",
        description: "Социальная торговля и копирование",
        image: "images/bingx.jpg",
        fallback: "📈"
    },
    {
        id: 3,
        name: "Bitget",
        url: "https://www.bitgetapps.com/ru/referral/register?clacCode=40FSP70H&from=%2Fru%2Fevents%2Freferral-all-program&source=events&utmSource=PremierInviter",
        description: "Инновационная торговая платформа",
        image: "images/bitget.jpg",
        fallback: "⚡"
    },
    {
        id: 4,
        name: "MEXC",
        url: "https://promote.mexc.com/r/aTSLfdm54W",
        description: "Глобальная биржа с низкими комиссиями",
        image: "images/mexc.jpg",
        fallback: "🌍"
    }
];

// ==================== УТИЛИТЫ ====================

function vibrate(duration = 30) {
    if (navigator.vibrate) {
        try { navigator.vibrate(duration); } catch (_) {}
    }
}

function openLink(url) {
    if (!url) return;
    const tg = window.Telegram?.WebApp;
    if (tg) {
        if (url.startsWith('https://t.me/')) {
            tg.openTelegramLink(url);
        } else {
            tg.openLink(url);
        }
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

function generateStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
        '<span class="star filled">★</span>'.repeat(full) +
        (half ? '<span class="star half">★</span>' : '') +
        '<span class="star">★</span>'.repeat(empty)
    );
}

let notifTimeout = null;
function showNotification(msg = 'Ссылка скопирована!') {
    const el = document.getElementById('notification');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    if (notifTimeout) clearTimeout(notifTimeout);
    notifTimeout = setTimeout(() => el.classList.remove('show'), 2200);
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', () => {
    initTelegramWebApp();
    loadThemePreference();
    setupNavigation();
    renderGames();
    renderExchanges();
    setupSettingsPanel();
    loadUserData();
    setupShareButton();
    setupBuyStarsButton();
    setupChatButton();
    initGame2048();
    // Небольшая задержка чтобы пропустить flash of unstyled
    setTimeout(() => document.body.style.opacity = '1', 50);
});

function initTelegramWebApp() {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    tg.ready();
    tg.expand();
    // Применяем цвета Telegram если есть
    const { themeParams } = tg;
    if (themeParams) {
        const map = {
            '--tg-theme-bg-color': themeParams.bg_color,
            '--tg-theme-text-color': themeParams.text_color,
            '--tg-theme-button-color': themeParams.button_color,
            '--tg-theme-button-text-color': themeParams.button_text_color,
        };
        Object.entries(map).forEach(([k, v]) => {
            if (v) document.documentElement.style.setProperty(k, v);
        });
    }
}

// ==================== ТЕМА ====================

function loadThemePreference() {
    const saved = localStorage.getItem('gv_theme') || 'light';
    applyTheme(saved);
}

function applyTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === theme);
    });
    localStorage.setItem('gv_theme', theme);
}

// ==================== НАВИГАЦИЯ ====================

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const header = document.getElementById('main-header');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            vibrate();
            const target = item.dataset.section;

            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            sections.forEach(s => {
                s.classList.remove('active');
                if (s.id === target) s.classList.add('active');
            });

            // Скрываем шапку на профиле (для большего пространства)
            if (header) {
                header.style.display = target === 'profile-section' ? 'none' : '';
            }

            // Сбрасываем скролл вверх при переключении секции
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// ==================== РЕНДЕР ИГР ====================

function renderGames() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;

    grid.innerHTML = GAMES_DATA.map(game => `
        <div class="game-card ${game.highlight ? 'highlight' : ''}">
            <div class="game-image">
                <img
                    src="${escapeAttr(game.image)}"
                    alt="${escapeAttr(game.name)}"
                    class="game-img"
                    loading="lazy"
                    onerror="this.style.display='none'"
                >
                <div class="image-fallback">${game.fallback}</div>
            </div>
            <div class="game-info">
                <div class="game-header">
                    <h3>${escapeHtml(game.name)}</h3>
                    ${game.badge ? `<span class="game-badge">${escapeHtml(game.badge)}</span>` : ''}
                </div>
                <p class="game-description">${escapeHtml(game.description)}</p>
                <div class="game-stats">
                    <div class="rating">
                        <div class="stars">${generateStars(game.rating)}</div>
                        <span class="rating-value">${game.rating}</span>
                    </div>
                    <div class="players">
                        <span class="players-icon">👥</span>
                        <span class="players-count">${escapeHtml(game.players)}</span>
                    </div>
                </div>
            </div>
            <button class="play-button" data-link="${escapeAttr(game.fullLink || '')}">
                Играть
            </button>
        </div>
    `).join('');

    grid.querySelectorAll('.play-button').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            vibrate();
            openLink(btn.dataset.link);
        });
    });
}

// ==================== РЕНДЕР БИРЖ ====================

function renderExchanges() {
    const list = document.getElementById('exchanges-list');
    if (!list) return;

    list.innerHTML = EXCHANGES_DATA.map(ex => `
        <div class="exchange-card">
            <div class="exchange-logo">
                <img
                    src="${escapeAttr(ex.image)}"
                    alt="${escapeAttr(ex.name)}"
                    class="exchange-img"
                    loading="lazy"
                    onerror="this.style.display='none'"
                >
                <div class="image-fallback">${ex.fallback}</div>
            </div>
            <div class="exchange-info">
                <h3>${escapeHtml(ex.name)}</h3>
                <p>${escapeHtml(ex.description)}</p>
            </div>
            <button class="exchange-button" data-url="${escapeAttr(ex.url)}">
                Перейти
            </button>
        </div>
    `).join('');

    list.querySelectorAll('.exchange-button').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            vibrate();
            openLink(btn.dataset.url);
        });
    });
}

// ==================== ПОЛЬЗОВАТЕЛЬ ====================

function loadUserData() {
    const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (user) {
        renderProfile(user);
        currentUserId = user.id;
        sendUserStat(user);
    } else {
        renderFallbackProfile();
    }
}

function renderProfile(user) {
    setEl('user-name', `${user.first_name || ''}${user.last_name ? ' ' + user.last_name : ''}`);
    setEl('user-username', user.username ? `@${user.username}` : 'Telegram User');

    const avatarImg = document.getElementById('avatar-img');
    const avatarFallback = document.getElementById('avatar-fallback');

    if (avatarImg && user.photo_url) {
        avatarImg.src = user.photo_url;
        avatarImg.style.display = 'block';
        avatarImg.onerror = () => {
            avatarImg.style.display = 'none';
            if (avatarFallback) {
                avatarFallback.textContent = (user.first_name || 'T').charAt(0).toUpperCase();
            }
        };
        if (avatarFallback) avatarFallback.style.display = 'none';
    } else {
        if (avatarFallback) {
            avatarFallback.textContent = (user.first_name || 'T').charAt(0).toUpperCase();
        }
    }

    if (user.is_premium) {
        const info = document.querySelector('.profile-info');
        if (info && !info.querySelector('.premium-badge')) {
            const badge = document.createElement('div');
            badge.className = 'premium-badge';
            badge.innerHTML = '⭐ Premium';
            info.appendChild(badge);
        }
    }
}

function renderFallbackProfile() {
    setEl('user-name', 'Telegram User');
    setEl('user-username', 'Открой в Telegram');
    const f = document.getElementById('avatar-fallback');
    if (f) f.textContent = 'T';
}

async function sendUserStat(user) {
    if (!user?.id) return;
    const date = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    const message =
        `🆕 *Новый пользователь в Games Verse*\n\n` +
        `👤 *Имя:* ${user.first_name || ''} ${user.last_name || ''}\n` +
        `🆔 *ID:* ${user.id}\n` +
        `🧑‍💻 *Username:* ${user.username ? '@' + user.username : 'нет'}\n` +
        `⭐ *Premium:* ${user.is_premium ? 'Да' : 'Нет'}\n` +
        `📅 *Дата:* ${date}`;
    try {
        await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, chatId: '6823288584' }),
        });
    } catch (_) {}
}

// ==================== НАСТРОЙКИ ====================

function setupSettingsPanel() {
    const panel = document.getElementById('settings-panel');
    const backdrop = document.getElementById('settings-backdrop');
    const openBtn = document.getElementById('settings-button');
    const closeBtn = document.getElementById('close-settings');
    const closeIcon = document.getElementById('close-settings-icon');

    const open = () => { vibrate(); panel?.classList.add('active'); };
    const close = () => { vibrate(); panel?.classList.remove('active'); };

    openBtn?.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    closeIcon?.addEventListener('click', close);
    backdrop?.addEventListener('click', close);

    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.addEventListener('click', () => {
            vibrate();
            applyTheme(opt.dataset.theme);
        });
    });
}

// ==================== ШАРИНГ ====================

function setupShareButton() {
    document.getElementById('share-friends-button')?.addEventListener('click', () => {
        vibrate();
        const botUrl = currentUserId
            ? `https://t.me/${BOT_USERNAME}?start=ref_${currentUserId}`
            : `https://t.me/${BOT_USERNAME}`;
        const shareText = 'Играй в лучшие мини-игры Telegram! 🎮';
        const tg = window.Telegram?.WebApp;

        if (tg) {
            const url = `https://t.me/share/url?url=${encodeURIComponent(botUrl)}&text=${encodeURIComponent(shareText)}`;
            try {
                tg.openTelegramLink(url);
            } catch (_) {
                copyToClipboard(botUrl);
            }
        } else if (navigator.share) {
            navigator.share({ title: 'Games Verse', text: shareText, url: botUrl })
                .catch(() => copyToClipboard(botUrl));
        } else {
            copyToClipboard(botUrl);
        }
    });
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => showNotification('Ссылка скопирована!'))
            .catch(() => legacyCopy(text));
    } else {
        legacyCopy(text);
    }
}

function legacyCopy(text) {
    const el = Object.assign(document.createElement('textarea'), {
        value: text,
        style: { position: 'fixed', opacity: '0', left: '-9999px' }
    });
    document.body.appendChild(el);
    el.select();
    try {
        document.execCommand('copy');
        showNotification('Ссылка скопирована!');
    } catch (_) {
        showNotification('Не удалось скопировать');
    }
    document.body.removeChild(el);
}

function setupBuyStarsButton() {
    document.getElementById('buy-stars-button')?.addEventListener('click', () => {
        vibrate();
        openLink('https://t.me/StarsShipBot?start=r6823288584');
    });
}

function setupChatButton() {
    document.getElementById('chat-button')?.addEventListener('click', () => {
        vibrate();
        openLink('https://t.me/hadron_chat');
    });
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function setEl(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;');
}

// ==================== 2048 GAME ====================

class Game2048 {
    constructor(boardEl, scoreEl, bestEl, statusEl) {
        this.boardEl = boardEl;
        this.scoreEl = scoreEl;
        this.bestEl = bestEl;
        this.statusEl = statusEl;
        this.SIZE = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('gv_bestScore2048') || '0', 10);
        this.lastAdded = null;
        this.mergedKeys = new Set();
        this.gameOver = false;
        this.won = false;

        this.updateBestUI();
        this.newGame();
        this.bindSwipe();
        this.bindKeyboard();
    }

    newGame() {
        this.grid = Array.from({ length: this.SIZE }, () => Array(this.SIZE).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        this.lastAdded = null;
        this.mergedKeys.clear();
        this.updateScoreUI();
        if (this.statusEl) this.statusEl.textContent = '';
        this.spawnTile();
        this.spawnTile();
        this.render();
    }

    spawnTile() {
        const empty = [];
        for (let r = 0; r < this.SIZE; r++)
            for (let c = 0; c < this.SIZE; c++)
                if (this.grid[r][c] === 0) empty.push([r, c]);
        if (!empty.length) return false;
        const [r, c] = empty[Math.floor(Math.random() * empty.length)];
        this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        this.lastAdded = `${r},${c}`;
        return true;
    }

    slide(line) {
        // Removes zeros, merges equal adjacent, pads with zeros
        const vals = line.filter(v => v);
        const merged = [];
        let gain = 0;
        for (let i = 0; i < vals.length; i++) {
            if (i + 1 < vals.length && vals[i] === vals[i + 1]) {
                const m = vals[i] * 2;
                merged.push(m);
                gain += m;
                i++;
            } else {
                merged.push(vals[i]);
            }
        }
        while (merged.length < this.SIZE) merged.push(0);
        return { row: merged, gain };
    }

    move(dir) {
        if (this.gameOver) return;
        const prev = this.grid.map(r => [...r]);
        let totalGain = 0;
        this.mergedKeys.clear();

        for (let i = 0; i < this.SIZE; i++) {
            let line;
            if (dir === 'left')  line = this.grid[i];
            if (dir === 'right') line = [...this.grid[i]].reverse();
            if (dir === 'up')    line = this.grid.map(r => r[i]);
            if (dir === 'down')  line = this.grid.map(r => r[i]).reverse();

            const { row, gain } = this.slide(line);
            totalGain += gain;

            if (dir === 'left')  this.grid[i] = row;
            if (dir === 'right') this.grid[i] = [...row].reverse();
            if (dir === 'up')    row.forEach((v, r) => this.grid[r][i] = v);
            if (dir === 'down')  [...row].reverse().forEach((v, r) => this.grid[r][i] = v);
        }

        const changed = prev.some((r, ri) => r.some((v, ci) => v !== this.grid[ri][ci]));
        if (!changed) return;

        this.score += totalGain;
        this.updateScoreUI();
        this.spawnTile();
        this.render();

        if (!this.won && this.grid.some(r => r.includes(2048))) {
            this.won = true;
            if (this.statusEl) this.statusEl.textContent = '🎉 Победа!';
        } else if (this.isGameOver()) {
            this.gameOver = true;
            if (this.statusEl) this.statusEl.textContent = '😔 Игра окончена';
        }
    }

    isGameOver() {
        for (let r = 0; r < this.SIZE; r++)
            for (let c = 0; c < this.SIZE; c++) {
                if (!this.grid[r][c]) return false;
                if (c + 1 < this.SIZE && this.grid[r][c] === this.grid[r][c + 1]) return false;
                if (r + 1 < this.SIZE && this.grid[r][c] === this.grid[r + 1][c]) return false;
            }
        return true;
    }

    render() {
        const board = this.boardEl;
        board.innerHTML = '';
        for (let r = 0; r < this.SIZE; r++) {
            for (let c = 0; c < this.SIZE; c++) {
                const v = this.grid[r][c];
                const cell = document.createElement('div');
                cell.className = 'tile-cell';
                if (v) {
                    const cls = v > 2048 ? 'tile-super' : `tile-${v}`;
                    cell.classList.add(cls);
                    cell.textContent = v;
                    const key = `${r},${c}`;
                    if (key === this.lastAdded) {
                        cell.classList.add('tile-new');
                    }
                }
                board.appendChild(cell);
            }
        }
        this.lastAdded = null;
    }

    updateScoreUI() {
        if (this.scoreEl) this.scoreEl.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('gv_bestScore2048', this.bestScore);
            this.updateBestUI();
        }
    }

    updateBestUI() {
        if (this.bestEl) this.bestEl.textContent = this.bestScore;
    }

    bindSwipe() {
        const el = this.boardEl;
        let sx = 0, sy = 0;
        el.addEventListener('touchstart', e => {
            sx = e.touches[0].clientX;
            sy = e.touches[0].clientY;
            e.preventDefault();
        }, { passive: false });
        el.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - sx;
            const dy = e.changedTouches[0].clientY - sy;
            if (Math.abs(dx) < 15 && Math.abs(dy) < 15) return;
            if (Math.abs(dx) > Math.abs(dy)) {
                this.move(dx > 0 ? 'right' : 'left');
            } else {
                this.move(dy > 0 ? 'down' : 'up');
            }
            vibrate(20);
        }, { passive: true });
    }

    bindKeyboard() {
        const map = {
            ArrowLeft: 'left', ArrowRight: 'right',
            ArrowUp: 'up', ArrowDown: 'down'
        };
        window.addEventListener('keydown', e => {
            // Реагируем на стрелки только если секция 2048 активна
            const section = document.getElementById('game2048-section');
            if (!section?.classList.contains('active')) return;
            if (map[e.key]) {
                e.preventDefault();
                this.move(map[e.key]);
                vibrate(20);
            }
        });
    }
}

function initGame2048() {
    const board = document.getElementById('game-board-2048');
    const scoreEl = document.getElementById('game-score');
    const bestEl = document.getElementById('best-score');
    const statusEl = document.getElementById('game-status');
    const newBtn = document.getElementById('new-game-btn');

    if (!board || !scoreEl || !bestEl || !statusEl) return;

    const game = new Game2048(board, scoreEl, bestEl, statusEl);

    newBtn?.addEventListener('click', () => {
        vibrate(40);
        game.newGame();
    });
}
