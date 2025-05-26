class Game {
    constructor() {
        this.mazeGenerator = new MazeGenerator();
        this.maze = this.mazeGenerator.getMaze();
        this.path = [];
        this.visited = [];
        this.currentPosition = { x: 1, y: 1 };
        this.endPosition = { x: MAZE_SIZE-2, y: MAZE_SIZE-2 };
        this.moves = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.isSolving = false;
        this.solvingMethod = null;
        this.solutionPath = [];
        this.animationSpeed = 100;
        this.shouldShowVictory = false;

        this.elements = {
            maze: document.getElementById('maze'),
            timer: document.getElementById('timer'),
            moves: document.getElementById('moves'),
            solveCorrect: document.getElementById('solveCorrect'),
            solveWrong: document.getElementById('solveWrong'),
            reset: document.getElementById('reset'),
            victoryModal: document.getElementById('victoryModal'),
            finalTime: document.getElementById('finalTime'),
            finalMoves: document.getElementById('finalMoves'),
            closeModal: document.getElementById('closeModal')
        };

        this.init();
    }

    init() {
        this.renderMaze();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.elements.solveCorrect.addEventListener('click', () => this.startSolving('correct'));
        this.elements.solveWrong.addEventListener('click', () => this.startSolving('wrong'));
        this.elements.reset.addEventListener('click', () => this.resetGame());
        this.elements.closeModal.addEventListener('click', () => this.closeModal());
    }

    startSolving(method) {
        if (this.isSolving) {
            this.resetGame();
            return;
        }
        
        this.isSolving = true;
        this.solvingMethod = method;
        this.moves = 0;
        this.timer = 0;
        this.shouldShowVictory = false;
        
        this.elements.solveCorrect.disabled = true;
        this.elements.solveWrong.disabled = true;
        
        if (method === 'correct') {
            this.solutionPath = this.findCorrectPath();
            this.path = [...this.solutionPath];
            this.startTimer();
            this.animateCorrectSolution();
        } else {
            this.path = [this.currentPosition];
            this.visited = [this.currentPosition];
            this.startTimer();
            this.solveWithBacktracking();
        }
    }

    findCorrectPath() {
        const queue = [[{x: 1, y: 1}]];
        const visited = new Set(['1,1']);
        
        while (queue.length > 0) {
            const path = queue.shift();
            const current = path[path.length - 1];
            
            if (current.x === this.endPosition.x && current.y === this.endPosition.y) {
                return path;
            }
            
            const directions = [
                {dx: 1, dy: 0}, {dx: 0, dy: 1},
                {dx: -1, dy: 0}, {dx: 0, dy: -1}
            ];
            
            for (const dir of directions) {
                const nx = current.x + dir.dx;
                const ny = current.y + dir.dy;
                const key = `${nx},${ny}`;
                
                if (nx >= 0 && nx < MAZE_SIZE && ny >= 0 && ny < MAZE_SIZE && 
                    this.maze[nx][ny] === 0 && !visited.has(key)) {
                    
                    visited.add(key);
                    queue.push([...path, {x: nx, y: ny}]);
                }
            }
        }
        
        return [];
    }

    animateCorrectSolution(index = 0) {
        if (!this.isSolving || index >= this.solutionPath.length) {
            if (this.isSolving) {
                this.shouldShowVictory = true;
                this.showVictory();
            }
            return;
        }
        
        this.currentPosition = this.solutionPath[index];
        this.moves = index + 1;
        this.updateStats();
        this.renderMaze();
        
        setTimeout(() => this.animateCorrectSolution(index + 1), this.animationSpeed);
    }

    solveWithBacktracking() {
        if (!this.isSolving) return;
        
        const current = this.path[this.path.length - 1];
        
        if (current.x === this.endPosition.x && current.y === this.endPosition.y) {
            this.shouldShowVictory = true;
            this.showVictory();
            return;
        }
        
        const directions = [
            {dx: 1, dy: 0}, {dx: 0, dy: 1},
            {dx: -1, dy: 0}, {dx: 0, dy: -1}
        ].sort(() => Math.random() - 0.5);
        
        let moved = false;
        
        for (const dir of directions) {
            const nx = current.x + dir.dx;
            const ny = current.y + dir.dy;
            const key = `${nx},${ny}`;
            
            if (nx >= 0 && nx < MAZE_SIZE && ny >= 0 && ny < MAZE_SIZE && 
                this.maze[nx][ny] === 0 && !this.visited.some(p => p.x === nx && p.y === ny)) {
                
                this.path.push({x: nx, y: ny});
                this.visited.push({x: nx, y: ny});
                this.currentPosition = {x: nx, y: ny};
                this.moves++;
                moved = true;
                
                this.updateStats();
                this.renderMaze();
                
                setTimeout(() => this.solveWithBacktracking(), this.animationSpeed);
                break;
            }
        }
        
        if (!moved && this.path.length > 1) {
            this.path.pop();
            this.currentPosition = this.path[this.path.length - 1];
            this.moves++;
            
            this.updateStats();
            this.renderMaze();
            
            setTimeout(() => this.solveWithBacktracking(), this.animationSpeed);
        } else if (!moved) {
            this.finishSolving(false);
        }
    }

    renderMaze() {
        this.elements.maze.innerHTML = '';
        
        for (let i = 0; i < MAZE_SIZE; i++) {
            for (let j = 0; j < MAZE_SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                if (this.maze[i][j] === 1) {
                    cell.classList.add('wall');
                } else if (i === this.currentPosition.x && j === this.currentPosition.y) {
                    cell.classList.add('current');
                } else if (i === 1 && j === 1) {
                    cell.classList.add('start');
                } else if (i === this.endPosition.x && j === this.endPosition.y) {
                    cell.classList.add('end');
                } else if (this.path.some(p => p.x === i && p.y === j)) {
                    cell.classList.add('path');
                } else if (this.visited.some(p => p.x === i && p.y === j)) {
                    cell.classList.add('visited');
                }
                
                this.elements.maze.appendChild(cell);
            }
        }
    }

    startTimer() {
        this.timer = 0;
        this.updateTimer();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    updateTimer() {
        this.timer++;
        const mins = Math.floor(this.timer / 60).toString().padStart(2, '0');
        const secs = (this.timer % 60).toString().padStart(2, '0');
        this.elements.timer.textContent = `${mins}:${secs}`;
    }

    updateStats() {
        this.elements.moves.textContent = this.moves;
    }

    showVictory() {
        if (!this.shouldShowVictory) return;
        
        clearInterval(this.timerInterval);
        this.elements.finalTime.textContent = this.elements.timer.textContent;
        this.elements.finalMoves.textContent = this.moves;
        this.elements.victoryModal.style.display = 'flex';
        this.finishSolving(true);
    }

    closeModal() {
        this.elements.victoryModal.style.display = 'none';
    }

    finishSolving(success) {
        clearInterval(this.timerInterval);
        this.isSolving = false;
        this.elements.solveCorrect.disabled = false;
        this.elements.solveWrong.disabled = false;
    }

    resetGame() {
        clearInterval(this.timerInterval);
        this.isSolving = false;
        this.shouldShowVictory = false;
        this.mazeGenerator = new MazeGenerator();
        this.maze = this.mazeGenerator.getMaze();
        this.path = [];
        this.visited = [];
        this.currentPosition = { x: 1, y: 1 };
        this.moves = 0;
        this.timer = 0;
        
        this.elements.timer.textContent = '00:00';
        this.elements.moves.textContent = '0';
        this.elements.solveCorrect.disabled = false;
        this.elements.solveWrong.disabled = false;
        this.elements.victoryModal.style.display = 'none';
        
        this.renderMaze();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
});