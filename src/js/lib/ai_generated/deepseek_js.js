// Load WebAssembly module
const wasmModule = (async () => {
    const response = await fetch('connect4_solver.wasm');
    const buffer = await response.arrayBuffer();
    const module = await WebAssembly.instantiate(buffer, {});
    return module.instance.exports;
})();

// Game state
let gameRunning = true;
let playerTurn = true;  // true = human (X), false = AI (O)
let aiPlayer = 1;       // AI plays as player 1 (O)
let humanPlayer = 0;    // Human plays as player 0 (X)

const canvas = document.getElementById('boardCanvas');
const ctx = canvas.getContext('2d');

// Draw board
function drawBoard() {
    const exports = wasmModule;
    if (!exports) return;

    const state = exports.getBoardState();
    if (!state) return;

    ctx.fillStyle = '#0066cc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let col = 0; col < 7; col++) {
        for (let row = 0; row < 6; row++) {
            const idx = col + row * 7;
            const cell = String.fromCharCode(state[idx]);

            ctx.beginPath();
            ctx.arc(35 + col * 70, 35 + row * 70, 28, 0, 2 * Math.PI);

            if (cell === 'X') {
                ctx.fillStyle = '#ffcc00';  // Yellow for player 0
            } else if (cell === 'O') {
                ctx.fillStyle = '#ff3300';  // Red for player 1
            } else {
                ctx.fillStyle = '#ffffff';
            }
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.stroke();
        }
    }
}

// Update UI
async function updateGame() {
    const exports = await wasmModule;
    if (!exports) return;

    const winner = exports.getWinner();
    const isOver = exports.isGameOver();

    if (winner === 0) {
        document.getElementById('status').innerHTML = '🏆 Yellow wins! 🏆';
        gameRunning = false;
    } else if (winner === 1) {
        document.getElementById('status').innerHTML = '🏆 Red wins! 🏆';
        gameRunning = false;
    } else if (winner === -1) {
        document.getElementById('status').innerHTML = '🤝 Draw! 🤝';
        gameRunning = false;
    } else {
        const currentPlayer = exports.getCurrentPlayer();
        if (currentPlayer === humanPlayer) {
            document.getElementById('status').innerHTML = 'Your turn (Yellow)';
            gameRunning = true;
        } else {
            document.getElementById('status').innerHTML = 'AI thinking... 🤖';
            gameRunning = false;
            await makeAIMove();
        }
    }

    drawBoard();
}

// Make AI move
async function makeAIMove() {
    const exports = await wasmModule;
    if (!exports) return;

    if (exports.isGameOver()) return;

    // Show thinking indicator
    document.getElementById('status').innerHTML = 'AI thinking... 🤖';

    // Use setTimeout to allow UI to update
    setTimeout(() => {
        const move = exports.getBestMove(aiPlayer);
        if (move >= 0 && move <= 6) {
            exports.playMove(move, aiPlayer);
            updateGame();
        }
    }, 100);
}

// Human move
async function humanMove(col) {
    const exports = await wasmModule;
    if (!exports) return;

    if (!gameRunning) return;
    if (exports.isGameOver()) return;

    const currentPlayer = exports.getCurrentPlayer();
    if (currentPlayer !== humanPlayer) return;

    if (exports.playMove(col, humanPlayer)) {
        updateGame();
    }
}

// Reset game
async function resetGame() {
    const exports = await wasmModule;
    if (!exports) return;

    exports.resetBoard();
    gameRunning = true;
    updateGame();
}

// Handle canvas click
function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const col = Math.floor(x / 70);
    if (col >= 0 && col < 7) {
        humanMove(col);
    }
}

// Initialize
async function init() {
    const exports = await wasmModule;
    if (!exports) {
        console.error('Failed to load WebAssembly');
        return;
    }

    exports.init();
    exports.resetBoard();

    canvas.addEventListener('click', handleCanvasClick);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    document.getElementById('aiMoveBtn').addEventListener('click', async () => {
        await makeAIMove();
    });
    document.getElementById('aiFirstBtn').addEventListener('click', async () => {
        await resetGame();
        setTimeout(async () => {
            await makeAIMove();
        }, 100);
    });

    updateGame();

    // Optional: display solver info
    setInterval(async () => {
        const exports = await wasmModule;
        if (exports) {
            const nodes = exports.getNodeCount();
            document.getElementById('info').innerHTML = `Search nodes: ${nodes}`;
        }
    }, 1000);
}

// Start when module loads
wasmModule.then(() => init());
