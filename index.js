const screens = document.querySelectorAll('.screen');
const screenDict = {};
screens.forEach(screen => {
    screenDict[screen.id] = screen;
});
const overlays = document.querySelectorAll('.overlay');
const overlayDict = {};
overlays.forEach(overlay => {
    overlayDict[overlay.id] = overlay;
});


const boardSizeSelector = document.getElementById('board-size-selector');
const matchCountSelector = document.getElementById('match-count-selector');

const player1ScoreDisplay = document.getElementById('player1-score');
const player2ScoreDisplay = document.getElementById('player2-score');

const currentTurnDisplay = document.getElementById('current-turn');

const winnerDisplay = document.getElementById('winner');


let state;

function resetState() {
    state = {
        currentScreen: 'menu',
        boardSize: 3,
        matchCount: 3,
        player1: {
            score: 0,
            symbol: 'X'
        },
        player2: {
            score: 0,
            symbol: 'O'
        },
        currentPlayer: 'player1'
    };
}

function resetBoardState(x) {
    state.board = Array(x).fill().map(() => Array(x).fill(''));
}


function cellClicked(r, c) {
    if (state.board[r][c] !== '')
        return;

    updateCell(r, c);

    console.log(`Cell ${r}, ${c} is now ${state.board[r][c]}`);

    updateUI();

    const winner = checkWin();
    if (winner) {
        state[winner].score++;
        gameOver(winner);
        return;
    }

    if (checkGameOver()) {
        gameOver(null);
        return;
    }

    switchPlayer();
}


function resetBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
}

function generateBoard(x) {
    const board = document.getElementById('board');

    for (let i = 0; i < x; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < x; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            cell.addEventListener('click', () => {
                cellClicked(i, j);
            });

            cell.innerHTML = `<span class="debug-info">${i}, ${j}</span>`;

            row.appendChild(cell);

            cell.addEventListener('mouseover', () => {
                cell.setAttribute('data-hover', state[state.currentPlayer].symbol);
            });
            cell.addEventListener('mouseout', () => {
                cell.removeAttribute('data-hover');
            });
        }
        board.appendChild(row);
    }
}

function gameOver(winner) {
    if (winner) {
        winnerDisplay.innerHTML = `${winner === 'player1' ? 'Player 1 (X)' : 'Player 2 (O)'} wins!`;
    } else {
        winnerDisplay.innerHTML = 'It\'s a draw!';
    }
    showOverlay('end');
}

function checkWin() {
    const board = state.board;
    const matchCount = state.matchCount;

    console.log(board);

    // Check each direction (row, column, diagonals) for a match - must be at least matchCount in a row

    // Check rows
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        for (let j = 0; j < row.length; j++) {
            if (row[j] === '') {
                continue;
            }

            let match = true;

            for (let k = 0; k < matchCount; k++) {
                if (j + k >= row.length || row[j + k] !== row[j]) {
                    match = false;
                    break;
                }
                if (row[j + k] !== row[j]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                return state.currentPlayer;
            }
        }
    }

    // Check columns
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === '') {
                continue;
            }

            let match = true;

            for (let k = 0; k < matchCount; k++) {
                if (i + k >= board.length || board[i + k][j] !== board[i][j]) {
                    match = false;
                    break;
                }
                if (board[i + k][j] !== board[i][j]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                return state.currentPlayer;
            }
        }
    }

    // Check diagonals
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === '') {
                continue;
            }

            let match = true;

            for (let k = 0; k < matchCount; k++) {
                if (i + k >= board.length || j + k >= board.length || board[i + k][j + k] !== board[i][j]) {
                    match = false;
                    break;
                }
                if (board[i + k][j + k] !== board[i][j]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                return state.currentPlayer;
            }
        }
    }

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === '') {
                continue;
            }

            let match = true;

            for (let k = 0; k < matchCount; k++) {
                if (i + k >= board.length || j - k < 0) {
                    match = false;
                    break;
                }
                if (board[i + k][j - k] !== board[i][j]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                return state.currentPlayer;
            }
        }
    }

    return null;
}

function checkGameOver() {
    const board = state.board;
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        for (let j = 0; j < row.length; j++) {
            if (row[j] === '') {
                return false;
            }
        }
    }
    return true;
}

function updateCell(r, c) {
    state.board[r][c] = state[state.currentPlayer].symbol;

    const cell = document.querySelector(`.row:nth-child(${r + 1}) .cell:nth-child(${c + 1})`);
    cell.classList.add('filled');
    cell.innerHTML = state.board[r][c];
}

function switchPlayer() {
    state.currentPlayer = state.currentPlayer === 'player1' ? 'player2' : 'player1';
}


function showScreen(screenName) {
    for (let screen in screenDict) {
        screenDict[screen].classList.remove('active');
    }
    screenDict[screenName].classList.add('active');
}

function showOverlay(overlayName) {
    for (let overlay in overlayDict) {
        overlayDict[overlay].classList.remove('active');
    }
    overlayDict[overlayName].classList.add('active');
}

function hideOverlay(overlayName) {
    overlayDict[overlayName].classList.remove('active');
}

function hideAllOverlays() {
    for (let overlay in overlayDict) {
        overlayDict[overlay].classList.remove('active');
    }
}

function updateUI() {
    player1ScoreDisplay.innerHTML = state.player1.score;
    player2ScoreDisplay.innerHTML = state.player2.score;

    currentTurnDisplay.innerHTML = state.currentPlayer === 'player1' ? 'Player 1 (X)' : 'Player 2 (O)';
}

// Start button onclick event
function startGame() {
    resetState();

    state.currentPlayer = Math.random() < 0.5 ? 'player1' : 'player2';
    state.boardSize = parseInt(boardSizeSelector.value);

    state.matchCount = parseInt(matchCountSelector.value);
    if (state.matchCount >= state.boardSize) {
        state.matchCount = state.boardSize;
        matchCountSelector.value = state.matchCount;
    }

    resetBoardState(state.boardSize);
    resetBoard();
    generateBoard(state.boardSize);
    updateUI();

    hideAllOverlays();
    showScreen('game');
}

function replay() {
    state.currentPlayer = Math.random() < 0.5 ? 'player1' : 'player2';

    resetBoard();
    resetBoardState(state.boardSize);
    generateBoard(state.boardSize);
    updateUI();

    hideAllOverlays();
    showScreen('game');
}

resetState();
showScreen('menu');
