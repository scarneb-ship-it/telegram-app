// ==================== КОНФИГУРАЦИЯ ====================
const BOT_USERNAME = 'khadron_bot';
let currentUserId = null;

const WORKER_URL = 'https://misty-poetry-f4b2.scarneb.workers.dev/';

const GAMES_DATA = [ /* ... без изменений ... */ ];
const EXCHANGES_DATA = [ /* ... без изменений ... */ ];

// ==================== ПЕРЕВОДЫ (только русский) ====================
const translations = {
    appTitle: "Games Verse",
    settings: "Настройки",
    theme: "Тема",
    lightTheme: "Светлая",
    darkTheme: "Темная",
    done: "Готово",
    games: "Игры",
    bestGames: "Лучшие игры Telegram",
    play: "Играть",
    exchanges: "Биржи",
    exchangesDesc: "Торгуйте криптовалютами безопасно",
    user: "Пользователь",
    shareWithFriends: "Поделиться с друзьями",
    profile: "Профиль",
    linkCopied: "Ссылка скопирована в буфер обмена!",
    go: "Перейти",
    game2048: "2048",
    score: "Счёт",
    best: "Лучший",
    newGame: "Новая игра",
    swipeHint: "👆 Свайпайте пальцем или используйте стрелки",
    gameWin: "Вы победили! 🎉",
    gameLose: "Игра окончена! 😔"
};

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function vibrate() {
    if (navigator.vibrate) navigator.vibrate(50);
}

function initializeApp() {
    initializeTelegramWebApp();
    setupNavigation();
    initializeGames();
    initializeExchanges();
    setupSettingsPanel();
    loadThemePreference();
    loadUserData();
    setupShareButton();
    setTimeout(() => document.body.style.opacity = '1', 100);
}

// ... (все остальные функции, не связанные с языком, остаются как в исходном коде,
//      кроме тех, что используют data-i18n – заменены прямыми строками из translations) ...

function getTranslation(key) {
    return translations[key] || key;
}

function loadLanguagePreference() {
    // Всегда русский, ничего не делаем
}

function setLanguage(lang) {
    // Игнорируем – язык всегда русский, просто применяем textContent для элементов с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) el.textContent = translations[key];
    });
}

// Упрощённая инициализация настроек – убираем языковой переключатель
function setupSettingsPanel() {
    const settingsButton = document.getElementById('settings-button');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettings = document.getElementById('close-settings');
    if (settingsButton) settingsButton.addEventListener('click', () => { vibrate(); settingsPanel.classList.add('active'); });
    if (closeSettings) closeSettings.addEventListener('click', () => { vibrate(); settingsPanel.classList.remove('active'); });
    if (settingsPanel) settingsPanel.addEventListener('click', (e) => { if (e.target === settingsPanel) settingsPanel.classList.remove('active'); });

    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            vibrate();
            const theme = this.getAttribute('data-theme');
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            if (theme === 'dark') document.body.classList.add('dark-theme');
            else document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', theme);
        });
    });
}

// ==================== 2048 GAME (улучшенная анимация) ====================
class Game2048 {
    constructor(boardElement, scoreElement, bestScoreElement, statusElement) {
        this.boardElement = boardElement;
        this.scoreElement = scoreElement;
        this.bestScoreElement = bestScoreElement;
        this.statusElement = statusElement;
        this.size = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = localStorage.getItem('bestScore2048') ? parseInt(localStorage.getItem('bestScore2048')) : 0;
        this.lastAddedTile = null;           // {x, y} – новая плитка
        this.mergedPositions = new Set();    // строки вида "row,col" где произошло слияние
        this.moveMap = null;                 // карта перемещений: "newRow,newCol" -> { fromRow, fromCol }

        this.updateBestScoreUI();
        this.init();
        this.setupSwipeEvents();
        this.setupKeyboardEvents();
    }

    init() {
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.updateScoreUI();
        this.statusElement.textContent = '';
        this.lastAddedTile = null;
        this.mergedPositions.clear();
        this.moveMap = null;
        this.addRandomTile();
        this.addRandomTile();
        this.render();
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) emptyCells.push({x: i, y: j});
            }
        }
        if (emptyCells.length > 0) {
            const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[x][y] = Math.random() < 0.9 ? 2 : 4;
            this.lastAddedTile = {x, y};
            return true;
        }
        return false;
    }

    // Основной метод движения
    move(direction) {
        const oldGrid = JSON.parse(JSON.stringify(this.grid));
        let totalScoreGain = 0;
        this.mergedPositions.clear();
        this.moveMap = {};   // сброс карты перемещений

        // Вспомогательная функция скольжения с записью перемещений
        const slideWithTracking = (row, isColumn, index, reverse) => {
            let arr = row.filter(v => v !== 0);
            let newRow = [];
            let scoreGain = 0;
            let merged = new Array(arr.length).fill(false);
            // Находим слияния и строим newRow
            for (let i = 0; i < arr.length; i++) {
                if (i + 1 < arr.length && arr[i] === arr[i + 1] && !merged[i] && !merged[i+1]) {
                    let mergedVal = arr[i] * 2;
                    newRow.push(mergedVal);
                    scoreGain += mergedVal;
                    merged[i] = merged[i+1] = true;
                    i++; // пропускаем следующий элемент
                } else {
                    newRow.push(arr[i]);
                }
            }
            while (newRow.length < this.size) newRow.push(0);

            // Теперь построим карту перемещений: какое значение из какой старой позиции попало в какую новую
            // arr содержит исходные значения (без нулей), newRow — результат.
            // Используем два указателя для сопоставления.
            let oldVals = arr;
            let oldPtr = 0;
            for (let newPos = 0; newPos < this.size; newPos++) {
                if (newRow[newPos] === 0) continue;
                // проверяем, было ли это слияние (новое значение больше каждого из двух старых)
                // Упрощённо: если oldPtr < oldVals.length и oldVals[oldPtr] * 2 === newRow[newPos] 
                // и следующий элемент такой же, то это слияние.
                if (oldPtr < oldVals.length && oldVals[oldPtr] * 2 === newRow[newPos] &&
                    oldPtr + 1 < oldVals.length && oldVals[oldPtr] === oldVals[oldPtr + 1]) {
                    // Слияние двух плиток
                    // Первая плитка
                    this.recordMove(oldPtr, oldVals, newPos, isColumn, index, reverse, true, false);
                    // Вторая плитка (та же целевая позиция, но она тоже участвовала)
                    this.recordMove(oldPtr + 1, oldVals, newPos, isColumn, index, reverse, true, true);
                    oldPtr += 2;
                } else if (oldPtr < oldVals.length && oldVals[oldPtr] === newRow[newPos]) {
                    // Просто перемещение
                    this.recordMove(oldPtr, oldVals, newPos, isColumn, index, reverse, false, false);
                    oldPtr++;
                }
            }
            return {newRow, scoreGain};
        };

        // Определим recordMove
        this.recordMove = (oldIdx, oldVals, newIdx, isColumn, lineIdx, reverse, merged, isSecond) => {
            // Преобразуем индексы в координаты (row, col)
            let fromRow, fromCol, toRow, toCol;
            // oldIdx — позиция в массиве oldVals, но нужно учесть исходные нули.
            // Восстановим исходную позицию в линии до сдвига.
            // Проще: получим массив исходной линии со старыми индексами.
            // Мы работаем с уже отфильтрованными значениями, поэтому восстановим исходную строку/столбец.
            const originalLine = [];
            if (!isColumn) {
                // строка lineIdx
                originalLine = this.grid[lineIdx].slice();
            } else {
                // столбец lineIdx
                for (let r = 0; r < this.size; r++) originalLine.push(this.grid[r][lineIdx]);
            }
            if (reverse) originalLine.reverse();

            // Находим индекс в originalLine, соответствующий oldVals[oldIdx]
            let skip = 0;
            let sourceIdx = -1;
            for (let i = 0; i < originalLine.length; i++) {
                if (originalLine[i] !== 0) {
                    if (skip === oldIdx) { sourceIdx = i; break; }
                    skip++;
                }
            }
            if (sourceIdx === -1) return; // ошибка, игнорируем

            // Если reverse, преобразуем обратно
            if (reverse) sourceIdx = this.size - 1 - sourceIdx;
            
            if (!isColumn) {
                fromRow = lineIdx;
                fromCol = sourceIdx;
            } else {
                fromRow = sourceIdx;
                fromCol = lineIdx;
            }

            // Целевая позиция
            let targetIdx = newIdx;
            if (reverse) targetIdx = this.size - 1 - newIdx;
            if (!isColumn) {
                toRow = lineIdx;
                toCol = targetIdx;
            } else {
                toRow = targetIdx;
                toCol = lineIdx;
            }

            const key = `${toRow},${toCol}`;
            if (!this.moveMap[key]) {
                this.moveMap[key] = { fromRow, fromCol, merged };
            }
            if (merged) this.mergedPositions.add(key);
        };

        // Применяем slideWithTracking для каждой линии
        if (direction === 'left') {
            for (let i = 0; i < this.size; i++) {
                const {newRow, scoreGain} = slideWithTracking(this.grid[i], false, i, false);
                this.grid[i] = newRow;
                totalScoreGain += scoreGain;
            }
        } else if (direction === 'right') {
            for (let i = 0; i < this.size; i++) {
                const reversed = [...this.grid[i]].reverse();
                const {newRow, scoreGain} = slideWithTracking(reversed, false, i, true);
                totalScoreGain += scoreGain;
                this.grid[i] = newRow.reverse();
            }
        } else if (direction === 'up') {
            for (let j = 0; j < this.size; j++) {
                const column = [];
                for (let i = 0; i < this.size; i++) column.push(this.grid[i][j]);
                const {newRow, scoreGain} = slideWithTracking(column, true, j, false);
                totalScoreGain += scoreGain;
                for (let i = 0; i < this.size; i++) this.grid[i][j] = newRow[i];
            }
        } else if (direction === 'down') {
            for (let j = 0; j < this.size; j++) {
                const column = [];
                for (let i = 0; i < this.size; i++) column.push(this.grid[i][j]);
                const reversed = column.reverse();
                const {newRow, scoreGain} = slideWithTracking(reversed, true, j, true);
                totalScoreGain += scoreGain;
                const finalArr = newRow.reverse();
                for (let i = 0; i < this.size; i++) this.grid[i][j] = finalArr[i];
            }
        }

        if (totalScoreGain > 0) {
            this.score += totalScoreGain;
            this.updateScoreUI();
        }

        const changed = !this.gridsAreEqual(oldGrid, this.grid);
        if (changed) {
            this.addRandomTile();
            this.render();
            if (this.checkWin()) {
                this.statusElement.textContent = translations.gameWin;
            } else if (this.checkLose()) {
                this.statusElement.textContent = translations.gameLose;
            }
        } else {
            this.moveMap = null;
        }
    }

    gridsAreEqual(a, b) {
        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.size; j++)
                if (a[i][j] !== b[i][j]) return false;
        return true;
    }

    render() {
        const board = this.boardElement;
        board.innerHTML = '';
        const tileSize = board.clientWidth / this.size; // использую для расчёта смещений

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const value = this.grid[i][j];
                const tile = document.createElement('div');
                tile.className = 'tile-cell';
                if (value !== 0) {
                    let tileClass = `tile-${value}`;
                    if (value > 2048) tileClass = 'tile-super';
                    tile.classList.add(tileClass);
                    tile.textContent = value;

                    // Анимация перемещения
                    const key = `${i},${j}`;
                    if (this.moveMap && this.moveMap[key]) {
                        const { fromRow, fromCol, merged } = this.moveMap[key];
                        const deltaX = (fromCol - j) * tileSize;
                        const deltaY = (fromRow - i) * tileSize;
                        // Сначала применяем обратное смещение для мгновенного позиционирования в старой точке
                        tile.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                        // Принудительный reflow
                        tile.offsetHeight;
                        // Убираем transform для запуска transition
                        tile.style.transform = '';
                        if (merged) {
                            tile.classList.add('tile-merge');
                            tile.addEventListener('animationend', () => tile.classList.remove('tile-merge'), { once: true });
                        }
                    }

                    // Анимация новой плитки
                    if (this.lastAddedTile && this.lastAddedTile.x === i && this.lastAddedTile.y === j) {
                        tile.classList.add('tile-new');
                        tile.addEventListener('animationend', () => tile.classList.remove('tile-new'), { once: true });
                    }
                } else {
                    tile.textContent = '';
                }
                board.appendChild(tile);
            }
        }
        this.lastAddedTile = null;
        this.moveMap = null;
    }

    updateScoreUI() {
        this.scoreElement.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore2048', this.bestScore);
            this.updateBestScoreUI();
        }
    }

    updateBestScoreUI() {
        this.bestScoreElement.textContent = this.bestScore;
    }

    checkWin() {
        return this.grid.some(row => row.includes(2048));
    }

    checkLose() {
        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.size; j++)
                if (this.grid[i][j] === 0) return false;
        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.size; j++) {
                const val = this.grid[i][j];
                if (j < this.size-1 && val === this.grid[i][j+1]) return false;
                if (i < this.size-1 && val === this.grid[i+1][j]) return false;
            }
        return true;
    }

    setupSwipeEvents() {
        // ... (без изменений) ...
    }

    setupKeyboardEvents() {
        // ... (без изменений) ...
    }

    resetGame() {
        this.init();
        this.render();
    }
}

// Инициализация игры
let game2048 = null;
function initGame2048() {
    const board = document.getElementById('game-board-2048');
    const scoreEl = document.getElementById('game-score');
    const bestEl = document.getElementById('best-score');
    const statusEl = document.getElementById('game-status');
    if (board && scoreEl && bestEl && statusEl && !game2048) {
        game2048 = new Game2048(board, scoreEl, bestEl, statusEl);
        const newGameBtn = document.getElementById('new-game-btn');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                vibrate();
                game2048.resetGame();
            });
        }
    }
}

setTimeout(() => {
    initGame2048();
}, 300);

// Остальные функции (загрузка игр, бирж, шаринг) — без изменений, только используют translations напрямую.
