import { generateMaze, solveMazeBacktracking } from "../maze/mazeGenerator.js";

document.addEventListener('DOMContentLoaded', function() {
    // Configurações
    const mazeElement = document.getElementById('maze');
    const rows = 15;
    const cols = 15;
    
    // Estado do jogo
    let playerPosition = { row: 0, col: 0 };
    let goalPosition = { row: rows-1, col: cols-1 };
    let moves = 0;
    let time = 0;
    let timer;
    let autoSolveInterval;
    let isAutoSolving = false;

    // Inicialização
    function initGame() {
        clearInterval(autoSolveInterval);
        isAutoSolving = false;
        
        // Calcula tamanho das células dinamicamente
        const mazeContainer = document.getElementById('maze-container');
        const containerSize = Math.min(
            mazeContainer.clientWidth, 
            mazeContainer.clientHeight
        );
        const cellSize = Math.floor(containerSize / Math.max(rows, cols));
        
        mazeElement.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
        mazeElement.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
        
        // Gera labirinto
        const mazeData = generateMaze(mazeElement, rows, cols);
        playerPosition = mazeData.start;
        goalPosition = mazeData.goal;
        
        updatePlayerPosition();
        resetCounters();
        enableControls();
    }
    
    function updatePlayerPosition() {
        document.querySelectorAll('.player').forEach(el => el.classList.remove('player'));
        const index = playerPosition.row * cols + playerPosition.col;
        if (mazeElement.children[index]) {
            mazeElement.children[index].classList.add('player');
        }
    }
    
    function resetCounters() {
        clearInterval(timer);
        moves = 0;
        time = 0;
        document.getElementById('moves').textContent = moves;
        document.getElementById('time').textContent = time;
        timer = setInterval(() => {
            time++;
            document.getElementById('time').textContent = time;
        }, 1000);
    }
    
    function enableControls() {
        document.getElementById('solve').disabled = false;
        document.getElementById('restart').disabled = false;
        document.getElementById('solve').textContent = "Resolver Auto";
    }

    // Movimento do jogador
    function handleMove(direction) {
        if (isAutoSolving) return;
        
        const newRow = playerPosition.row + direction.row;
        const newCol = playerPosition.col + direction.col;
        
        if (isValidMove(newRow, newCol)) {
            playerPosition = { row: newRow, col: newCol };
            moves++;
            document.getElementById('moves').textContent = moves;
            updatePlayerPosition();
            checkWin();
        }
    }
    
    function isValidMove(row, col) {
        if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
        const index = row * cols + col;
        return mazeElement.children[index] && !mazeElement.children[index].classList.contains('wall');
    }
    
    function checkWin() {
        if (playerPosition.row === goalPosition.row && playerPosition.col === goalPosition.col) {
            clearInterval(timer);
            setTimeout(() => {
                alert(`Parabéns! ${time}s e ${moves} movimentos!`);
            }, 100);
        }
    }

    // Resolução automática
    function autoSolve() {
        if (isAutoSolving) return;
        
        isAutoSolving = true;
        const solveBtn = document.getElementById('solve');
        solveBtn.disabled = true;
        solveBtn.textContent = "Resolvendo...";
        document.getElementById('restart').disabled = true;
        
        const path = solveMazeBacktracking(
            mazeElement, 
            rows, 
            cols, 
            playerPosition, 
            goalPosition
        );
        
        // Animação da solução
        let step = 0;
        autoSolveInterval = setInterval(() => {
            if (step >= path.length) {
                finishAutoSolve();
                return;
            }
            
            const [row, col] = path[step];
            playerPosition = { row, col };
            updatePlayerPosition();
            step++;
            moves++;
            document.getElementById('moves').textContent = moves;
            
            if (row === goalPosition.row && col === goalPosition.col) {
                finishAutoSolve();
                setTimeout(() => {
                    alert(`Resolvido em ${moves} movimentos!`);
                }, 300);
            }
        }, 200);
    }
    
    function finishAutoSolve() {
        clearInterval(autoSolveInterval);
        isAutoSolving = false;
        enableControls();
    }

    // Controles
    const directions = {
        up: { row: -1, col: 0 },
        down: { row: 1, col: 0 },
        left: { row: 0, col: -1 },
        right: { row: 0, col: 1 }
    };
    
    // Teclado
    document.addEventListener('keydown', (e) => {
        if (isAutoSolving) return;
        switch(e.key) {
            case 'ArrowUp': handleMove(directions.up); break;
            case 'ArrowDown': handleMove(directions.down); break;
            case 'ArrowLeft': handleMove(directions.left); break;
            case 'ArrowRight': handleMove(directions.right); break;
        }
    });
    
    // Touch controls
    ['up', 'down', 'left', 'right'].forEach(dir => {
        const btn = document.getElementById(dir);
        btn.addEventListener('click', () => handleMove(directions[dir]));
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleMove(directions[dir]);
        });
    });
    
    document.getElementById('restart').addEventListener('click', initGame);
    document.getElementById('solve').addEventListener('click', autoSolve);
    
    // Inicia o jogo
    initGame();
    
    // Redimensionamento responsivo
    window.addEventListener('resize', initGame);
});