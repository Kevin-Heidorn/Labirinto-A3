import { initializeMaze, generateMaze } from "../maze/mazeGenerator.js";

document.addEventListener('DOMContentLoaded', function() {
    const mazeElement = document.getElementById('maze');
    const rows = 15;
    const cols = 15;
    let playerPosition = { row: 0, col: 0 };
    let goalPosition = { row: rows-1, col: cols-1 };
    let moves = 0;
    let time = 0;
    let timer;

    // Inicializa o jogo
    function initGame() {
        // Gera novo labirinto
        const positions = generateMaze(mazeElement, rows, cols);
        playerPosition = positions.start;
        goalPosition = positions.goal;
        
        // Posiciona jogador
        const startIndex = playerPosition.row * cols + playerPosition.col;
        mazeElement.children[startIndex].classList.add('player');
        
        // Configura goal
        const goalIndex = goalPosition.row * cols + goalPosition.col;
        mazeElement.children[goalIndex].classList.add('goal');
        
        // Reinicia contadores
        resetCounters();
    }

    function resetCounters() {
        clearInterval(timer);
        moves = 0;
        time = 0;
        document.getElementById('moves').textContent = moves;
        document.getElementById('time').textContent = time;
        
        // Inicia timer
        timer = setInterval(() => {
            time++;
            document.getElementById('time').textContent = time;
        }, 1000);
    }

    function movePlayer(direction) {
        const newPos = {
            row: playerPosition.row + direction.row,
            col: playerPosition.col + direction.col
        };
        
        // Verifica se o movimento é válido
        if (isValidMove(newPos)) {
            // Atualiza posição do jogador
            const oldIndex = playerPosition.row * cols + playerPosition.col;
            const newIndex = newPos.row * cols + newPos.col;
            
            mazeElement.children[oldIndex].classList.remove('player');
            mazeElement.children[newIndex].classList.add('player');
            
            playerPosition = newPos;
            moves++;
            document.getElementById('moves').textContent = moves;
            
            // Verifica se chegou ao objetivo
            checkWinCondition();
        }
    }

    function isValidMove(position) {
        // Verifica limites
        if (position.row < 0 || position.row >= rows || 
            position.col < 0 || position.col >= cols) {
            return false;
        }
        
        // Verifica se não é parede
        const index = position.row * cols + position.col;
        return !mazeElement.children[index].classList.contains('wall');
    }

    function checkWinCondition() {
        if (playerPosition.row === goalPosition.row && 
            playerPosition.col === goalPosition.col) {
            clearInterval(timer);
            setTimeout(() => {
                alert(`Parabéns! Você completou em ${time} segundos e ${moves} movimentos!`);
                initGame();
            }, 100);
        }
    }

    // Event listeners
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp': movePlayer({ row: -1, col: 0 }); break;
            case 'ArrowDown': movePlayer({ row: 1, col: 0 }); break;
            case 'ArrowLeft': movePlayer({ row: 0, col: -1 }); break;
            case 'ArrowRight': movePlayer({ row: 0, col: 1 }); break;
        }
    });

    document.getElementById('up').addEventListener('click', () => movePlayer({ row: -1, col: 0 }));
    document.getElementById('down').addEventListener('click', () => movePlayer({ row: 1, col: 0 }));
    document.getElementById('left').addEventListener('click', () => movePlayer({ row: 0, col: -1 }));
    document.getElementById('right').addEventListener('click', () => movePlayer({ row: 0, col: 1 }));
    document.getElementById('restart').addEventListener('click', initGame);

    // Inicia o jogo
    initGame();
});