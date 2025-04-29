import { generateMaze, solveMazeWithMistakes } from "../maze/mazeGenerator.js";

document.addEventListener('DOMContentLoaded', function() {
    // Configurações do labirinto
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

    // ► 1. FUNÇÃO QUE FINALIZA O JOGO
    function finishGame() {
        clearInterval(timer);
        clearInterval(autoSolveInterval);
        isAutoSolving = false;
        
        // Desativa controles
        document.getElementById('solve').disabled = true;
        document.querySelectorAll('.arrow-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        // Mostra mensagem de vitória
        setTimeout(() => {
            alert(`🏆 Parabéns! Tempo: ${time}s | Movimentos: ${moves}`);
        }, 100);
    }

    // ► 2. VERIFICA SE CHEGOU NO VERDE
    function checkWin() {
        const index = playerPosition.row * cols + playerPosition.col;
        if (mazeElement.children[index].classList.contains('goal')) {
            finishGame();
            return true;
        }
        return false;
    }

    // ► 3. INICIALIZA O JOGO
    function initGame() {
        clearInterval(autoSolveInterval);
        isAutoSolving = false;
        
        const mazeContainer = document.getElementById('maze-container');
        const containerSize = Math.min(mazeContainer.clientWidth, mazeContainer.clientHeight);
        const cellSize = Math.floor(containerSize / Math.max(rows, cols));
        
        mazeElement.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
        mazeElement.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
        
        const mazeData = generateMaze(mazeElement, rows, cols);
        playerPosition = mazeData.start;
        goalPosition = mazeData.goal;
        
        updatePlayerPosition();
        resetCounters();
        enableControls();
    }

    // ► 4. ATUALIZA POSIÇÃO DO JOGADOR
    function updatePlayerPosition() {
        document.querySelectorAll('.player').forEach(el => el.classList.remove('player'));
        const index = playerPosition.row * cols + playerPosition.col;
        mazeElement.children[index].classList.add('player');
    }

    // ► 5. RESETA CONTADORES
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

    // ► 6. ATIVA CONTROLES
    function enableControls() {
        document.getElementById('solve').disabled = false;
        document.getElementById('restart').disabled = false;
        document.querySelectorAll('.arrow-btn').forEach(btn => {
            btn.disabled = false;
        });
        document.getElementById('solve').textContent = "Resolver Auto";
    }

    // ► 7. MOVIMENTO MANUAL
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

    // ► 8. VERIFICA MOVIMENTO VÁLIDO
    function isValidMove(row, col) {
        if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
        const index = row * cols + col;
        return !mazeElement.children[index].classList.contains('wall');
    }

    // ► 9. RESOLUÇÃO AUTOMÁTICA (VERSÃO CORRIGIDA)
    function autoSolve() {
        if (isAutoSolving) return;
        
        isAutoSolving = true;
        document.getElementById('solve').disabled = true;
        document.getElementById('solve').textContent = "Resolvendo...";
        document.querySelectorAll('.arrow-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        const path = solveMazeWithMistakes(mazeElement, rows, cols, playerPosition, goalPosition);
        
        let step = 0;
        autoSolveInterval = setInterval(() => {
            // Para tudo se chegou no final
            if (step >= path.length || checkWin()) {
                clearInterval(autoSolveInterval);
                isAutoSolving = false;
                return;
            }
            
            // Move o jogador
            playerPosition = { row: path[step][0], col: path[step][1] };
            updatePlayerPosition();
            
            // Atualiza contador
            moves++;
            document.getElementById('moves').textContent = moves;
            
            step++;
        }, 200);
    }

    // ► 10. CONTROLES
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
    
    // Botões de seta
    ['up', 'down', 'left', 'right'].forEach(dir => {
        document.getElementById(dir).addEventListener('click', () => handleMove(directions[dir]));
    });
    
    // Botões de ação
    document.getElementById('restart').addEventListener('click', initGame);
    document.getElementById('solve').addEventListener('click', autoSolve);
    
    // INICIA O JOGO
    initGame();
    window.addEventListener('resize', initGame);
});