const screens = document.querySelectorAll('.screen');

const screenDict = {};
screens.forEach(screen => {
    screenDict[screen.id] = screen;
});


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

