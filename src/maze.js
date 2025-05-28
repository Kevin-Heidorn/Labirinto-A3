class MazeGenerator {
    constructor(size = 25) {
    // Garante que o tamanho seja ímpar
        this.size = size % 2 === 0 ? size + 1 : size;
        this.maze = [];
        this.initialize();
    }

    initialize() {
        // Cria labirinto vazio como matriz
        this.maze = Array(this.size).fill().map(() => Array(this.size).fill(0));
        
        // Adiciona paredes externas
        for (let i = 0; i < this.size; i++) {
            this.maze[0][i] = 1; // Parede superior
            this.maze[this.size-1][i] = 1; // Parede inferior
            this.maze[i][0] = 1; // Parede esquerda
            this.maze[i][this.size-1] = 1; // Parede direita
        }
        
        // Adiciona paredes internas
        this.generateWalls();
        
        // Garante início e fim
        this.maze[1][1] = 0; // Posição inicial
        this.maze[this.size-2][this.size-2] = 0; // Posição final
    }

    generateWalls() {
        // Gera paredes internas em posições pares
        for (let i = 2; i < this.size-2; i += 2) {
            for (let j = 2; j < this.size-2; j += 2) {
                this.maze[i][j] = 1; // Cria um bloco de parede
                
                // Direções possíveis para criar passagens
                const directions = [
                    {dx: 1, dy: 0}, // Direita
                    {dx: 0, dy: 1}, // Baixo
                    {dx: -1, dy: 0}, // Esquerda
                    {dx: 0, dy: -1} // Cima
                ].sort(() => Math.random() - 0.5); // Embaralha as direções
                
                // Tenta criar uma passagem em uma direção aleatória
                for (const dir of directions) {
                    const nx = i + dir.dx;
                    const ny = j + dir.dy;
                    if (nx > 0 && nx < this.size-1 && ny > 0 && ny < this.size-1 && this.maze[nx][ny] === 0) {
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

    getSize() {
        return this.size;
    }
}