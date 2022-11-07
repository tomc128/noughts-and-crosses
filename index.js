const screens = document.querySelectorAll('.screen');

const screenDict = {};
screens.forEach(screen => {
    screenDict[screen.id] = screen;
});


function cellClicked(r, c) {
    console.log(`Cell clicked: row ${r}, column ${c}`);
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



function showScreen(screenName) {
    for (let screen in screenDict) {
        screenDict[screen].classList.remove('active');
    }
    screenDict[screenName].classList.add('active');
}

// Start button onclick event
function startGame() {
    showScreen('game');
}

showScreen('menu');
generateBoard(3);
