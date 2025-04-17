import { createMazeStructure, generateMazeWithBacktracking } from "../";

document.addEventListener('DOMContentLoaded', function () {
    const maze = document.getElementById('maze');
    const rows = 20;
    const cols = 20;
    let playerPosition = { row: 0, col: 0 };
    let moves = 0;
    let time = 0;
    let timerInterval;

    const directions = [
        { row: -1, col: 0 }, { row: 1, col: 0 },
        { row: 0, col: -1 }, { row: 0, col: 1 }
    ];

    function movePlayer(newRow, newCol) {
        const newIndex = newRow * cols + newCol;
        const newCell = maze.children[newIndex];
        if (newCell && !newCell.classList.contains('wall')) {
            maze.children[playerPosition.row * cols + playerPosition.col].classList.remove('player');
            newCell.classList.add('player');
            playerPosition = { row: newRow, col: newCol };
            moves++;
            document.getElementById('moves').textContent = moves;

            if (newCell.classList.contains('goal')) {
                clearInterval(timerInterval);
                alert(`Parabéns! Você venceu o jogo em ${time} segundos e ${moves} movimentos!`);
                resetGame();
            }
        }
    }

    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'ArrowUp': movePlayer(playerPosition.row - 1, playerPosition.col); break;
            case 'ArrowDown': movePlayer(playerPosition.row + 1, playerPosition.col); break;
            case 'ArrowLeft': movePlayer(playerPosition.row, playerPosition.col - 1); break;
            case 'ArrowRight': movePlayer(playerPosition.row, playerPosition.col + 1); break;
        }
    });

    document.getElementById('up').addEventListener('click', () => movePlayer(playerPosition.row - 1, playerPosition.col));
    document.getElementById('down').addEventListener('click', () => movePlayer(playerPosition.row + 1, playerPosition.col));
    document.getElementById('left').addEventListener('click', () => movePlayer(playerPosition.row, playerPosition.col - 1));
    document.getElementById('right').addEventListener('click', () => movePlayer(playerPosition.row, playerPosition.col + 1));

    function startTimer() {
        time = 0;
        document.getElementById('time').textContent = time;
        timerInterval = setInterval(() => {
            time++;
            document.getElementById('time').textContent = time;
        }, 1000);
    }

    function resetGame() {
        clearInterval(timerInterval);
        moves = 0;
        document.getElementById('moves').textContent = moves;

        createMazeStructure(maze, rows, cols);
        generateMazeWithBacktracking(maze, 0, 0, rows, cols);

        // Remover algumas paredes próximas à célula final
        const goalIndex = (rows - 1) * cols + (cols - 1);
        maze.children[goalIndex].classList.remove('wall');
        maze.children[goalIndex].classList.add('goal');

        // Posicionar o jogador
        playerPosition = { row: 0, col: 0 };
        maze.children[0].classList.add('player');

        startTimer();
    }

    document.getElementById('restart').addEventListener('click', resetGame);
    resetGame();
});
