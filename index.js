const screens = document.querySelectorAll('.screen');
const boardSizeSelector = document.getElementById('board-size-selector');

const player1ScoreDisplay = document.getElementById('player1-score');
const player2ScoreDisplay = document.getElementById('player2-score');

const currentTurnDisplay = document.getElementById('current-turn');

const winnerDisplay = document.getElementById('winner');

const screenDict = {};
screens.forEach(screen => {
    screenDict[screen.id] = screen;
});

let state;

function resetState() {
    state = {
        currentScreen: 'menu',
        boardSize: 3,
        player1: {
            score: 0,
            symbol: 'X'
        },
        player2: {
            score: 0,
            symbol: 'O'
        },
        currentPlayer: 'player1',
        board: [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ]
    };
}

function resetBoardState() {
    state.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ]
}


function cellClicked(r, c) {
    if (state.board[r][c] !== '')
        return;

    state.board[r][c] = state[state.currentPlayer].symbol;

    console.log(`Cell ${r}, ${c} is now ${state.board[r][c]}`);

    updateCell(r, c);
    switchPlayer();
    updateUI();

    const winner = checkWin();
    if (winner) {
        state[winner].score++;
        gameOver(winner);
    }

    if (checkGameOver()) {
        gameOver(null);
    }
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
    showScreen('end');
}

function checkWin() {
    const board = state.board;

    // check rows
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        if (row.every(cell => cell === row[0] && cell !== '')) {
            return row[0] === state.player1.symbol ? 'player1' : 'player2';
        }
    }

    // check columns
    for (let i = 0; i < board.length; i++) {
        const column = board.map(row => row[i]);
        if (column.every(cell => cell === column[0] && cell !== '')) {
            return column[0] === state.player1.symbol ? 'player1' : 'player2';
        }
    }

    // check diagonals
    const diagonal1 = board.map((row, i) => row[i]);
    const diagonal2 = board.map((row, i) => row[board.length - i - 1]);

    if (diagonal1.every(cell => cell === diagonal1[0] && cell !== '')) {
        return diagonal1[0] === state.player1.symbol ? 'player1' : 'player2';
    }

    if (diagonal2.every(cell => cell === diagonal2[0] && cell !== '')) {
        return diagonal2[0] === state.player1.symbol ? 'player1' : 'player2';
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
    const cell = document.querySelector(`.row:nth-child(${r + 1}) .cell:nth-child(${c + 1})`);
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

function updateUI() {
    player1ScoreDisplay.innerHTML = state.player1.score;
    player2ScoreDisplay.innerHTML = state.player2.score;

    currentTurnDisplay.innerHTML = state.currentPlayer === 'player1' ? 'Player 1 (X)' : 'Player 2 (O)';
}

// Start button onclick event
function startGame() {
    showScreen('game');

    state.boardSize = parseInt(boardSizeSelector.value);

    // choose random player to start
    state.currentPlayer = Math.random() < 0.5 ? 'player1' : 'player2';

    resetState();
    resetBoard();
    generateBoard(state.boardSize);
    updateUI();
}

function replay() {
    showScreen('game');

    // choose random player to start
    state.currentPlayer = Math.random() < 0.5 ? 'player1' : 'player2';

    resetBoardState();
    resetBoard();
    generateBoard(state.boardSize);
    updateUI();
}

resetState();
showScreen('menu');
