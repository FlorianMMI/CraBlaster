import enemyBehavior from "./enemyBehavior.js";
import { startmenu } from "./start.js";
import { endmenu } from "./end.js";

// Game state
let isRunning = false;
let lastTime = 0;
let gameScore = 0;

// Initialize your game (show start menu)
function init() {
    console.log("Init called");
    
    // Wait for A-Frame scene to be ready
    let aScene = document.querySelector("a-scene");
    
    // Écouter l'événement de fin de partie
    aScene.addEventListener('game-end', () => {
        console.log('🏁 Fin de partie détectée, affichage de l\'écran de fin');
        stopGame();
        endmenu(startGame);
    });
    
    if (aScene.hasLoaded) {
        console.log("Scene already loaded, showing menu");
        startmenu(startGame);
    } else {
        console.log("Waiting for scene to load");
        aScene.addEventListener('loaded', () => {
            console.log("Scene loaded, showing menu");
            startmenu(startGame);
        });
    }
}

// Main game loop - runs every frame
function gameLoop(currentTime) {
    if (!isRunning) return;
    
    // Calculate delta time (time since last frame)
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;
    
    // Update game logic
    update(deltaTime);
    
    // Render/draw
    render();
    
    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Update game logic
function update(deltaTime) {
    let enemies = document.querySelectorAll('[data-tag="enemy"]');
    for (let enemy of enemies) {
        enemyBehavior(enemy);
    }
}

// Render/draw
function render() {
    // Draw your game here
}

// Score management
export function addScore(points) {
    gameScore += points;
    updateScoreDisplay();
    console.log(`➕ +${points} points | Score: ${gameScore}`);
}

export function removeScore(points) {
    gameScore -= points;
    if (gameScore < 0) gameScore = 0;
    updateScoreDisplay();
    console.log(`➖ -${points} points | Score: ${gameScore}`);
}

export function getScore() {
    return gameScore;
}

function updateScoreDisplay() {
    let aScene = document.querySelector("a-scene");
    let scoreText = aScene.querySelector('[data-score-display]');
    if (scoreText) {
        scoreText.setAttribute("value", `Score: ${gameScore}`);
    }
}

// Start/stop controls
function startGame() {
    console.log("Game started");
    if (!isRunning) {
        isRunning = true;
        gameScore = 0; // Réinitialiser le score
        updateScoreDisplay();
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
}

function stopGame() {
    isRunning = false;
}

// Start the game
init();
