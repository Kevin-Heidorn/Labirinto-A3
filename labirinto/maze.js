const MAZE_SIZE = 25;

class MazeGenerator {
    constructor() {
        this.maze = [];
        this.initialize();
    }

    initialize() {
        // Cria labirinto vazio
        this.maze = Array(MAZE_SIZE).fill().map(() => Array(MAZE_SIZE).fill(0));
        
        // Adiciona paredes externas
        for (let i = 0; i < MAZE_SIZE; i++) {
            this.maze[0][i] = 1;
            this.maze[MAZE_SIZE-1][i] = 1;
            this.maze[i][0] = 1;
            this.maze[i][MAZE_SIZE-1] = 1;
        }
        
        // Adiciona paredes internas
        this.generateWalls();
        
        // Garante início e fim
        this.maze[1][1] = 0;
        this.maze[MAZE_SIZE-2][MAZE_SIZE-2] = 0;
    }

    generateWalls() {
        for (let i = 2; i < MAZE_SIZE-2; i += 2) {
            for (let j = 2; j < MAZE_SIZE-2; j += 2) {
                this.maze[i][j] = 1;
                
                const directions = [
                    {dx: 1, dy: 0}, {dx: 0, dy: 1},
                    {dx: -1, dy: 0}, {dx: 0, dy: -1}
                ].sort(() => Math.random() - 0.5);
                
                for (const dir of directions) {
                    const nx = i + dir.dx;
                    const ny = j + dir.dy;
                    if (nx > 0 && nx < MAZE_SIZE-1 && ny > 0 && ny < MAZE_SIZE-1 && this.maze[nx][ny] === 0) {
                        this.maze[nx][ny] = 1;
                        break;
                    }
                }
            }
        }
    }

    getMaze() {
        return this.maze;
    }
}