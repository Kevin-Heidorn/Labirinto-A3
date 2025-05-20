// Gera o labirinto
export function generateMaze(container, rows, cols) {
    container.innerHTML = '';
    
    // Cria todas as células como paredes
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('wall');
        container.appendChild(cell);
    }
    
    // Função que abre caminhos no labirinto
    function carvePath(row, col) {
        const index = row * cols + col;
        container.children[index].classList.remove('wall');
        container.children[index].classList.add('path');
        
        const directions = shuffle([
            {row: -2, col: 0}, {row: 2, col: 0}, // Cima/Baixo
            {row: 0, col: -2}, {row: 0, col: 2}  // Esquerda/Direita
        ]);
        
        for (const dir of directions) {
            const newRow = row + dir.row;
            const newCol = col + dir.col;
            
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && 
                container.children[newRow * cols + newCol].classList.contains('wall')) {
                
                const midRow = row + dir.row / 2;
                const midCol = col + dir.col / 2;
                container.children[midRow * cols + midCol].classList.remove('wall');
                container.children[midRow * cols + midCol].classList.add('path');
                
                carvePath(newRow, newCol);
            }
        }
    }
    
    carvePath(0, 0);
    
    // Define início (jogador) e fim (quadrado verde)
    container.children[0].classList.add('player');
    container.children[rows * cols - 1].classList.add('goal');
    
    return {
        start: { row: 0, col: 0 },
        goal: { row: rows - 1, col: cols - 1 }
    };
}

// Função que resolve o labirinto (com erros propositais)
export function solveMazeWithMistakes(container, rows, cols, start, goal) {
    const fullPath = [];
    const visited = new Array(rows * cols).fill(false);
    
    function explore(current, path) {
        const [row, col] = current;
        const index = row * cols + col;
        
        // Se chegou no objetivo, retorna o caminho
        if (row === goal.row && col === goal.col) {
            fullPath.push(...path, [row, col]);
            return true;
        }
        
        if (row < 0 || row >= rows || col < 0 || col >= cols || 
            visited[index] || container.children[index].classList.contains('wall')) {
            return false;
        }
        
        visited[index] = true;
        path.push([row, col]);
        fullPath.push([row, col]);
        
        // Às vezes erra de propósito (30% de chance)
        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        if (Math.random() < 0.9) directions.reverse();
        
        for (const [dr, dc] of directions) {
            if (explore([row + dr, col + dc], path)) {
                return true;
            }
        }
        
        path.pop();
        fullPath.push([row, col]); // Backtracking
        return false;
    }
    
    explore([start.row, start.col], []);
    return fullPath;
}

// Função para misturar array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
