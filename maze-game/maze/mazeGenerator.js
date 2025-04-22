// Geração do labirinto
export function generateMaze(container, rows, cols) {
    container.innerHTML = '';
    
    // Cria células
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('wall');
        container.appendChild(cell);
    }
    
    // Backtracking para gerar labirinto
    function carvePath(row, col) {
        const index = row * cols + col;
        container.children[index].classList.remove('wall');
        container.children[index].classList.add('path');
        
        const directions = shuffle([
            {row: -2, col: 0}, {row: 2, col: 0},
            {row: 0, col: -2}, {row: 0, col: 2}
        ]);
        
        for (const dir of directions) {
            const newRow = row + dir.row;
            const newCol = col + dir.col;
            
            if (newRow >= 0 && newRow < rows && 
                newCol >= 0 && newCol < cols && 
                container.children[newRow * cols + newCol].classList.contains('wall')) {
                
                const midRow = row + dir.row/2;
                const midCol = col + dir.col/2;
                container.children[midRow * cols + midCol].classList.remove('wall');
                container.children[midRow * cols + midCol].classList.add('path');
                
                carvePath(newRow, newCol);
            }
        }
    }
    
    carvePath(0, 0);
    
    // Define entrada e saída
    container.children[0].classList.add('player');
    container.children[rows*cols-1].classList.add('goal');
    
    return {
        start: { row: 0, col: 0 },
        goal: { row: rows-1, col: cols-1 }
    };
}

// Resolução com backtracking
export function solveMazeBacktracking(container, rows, cols, start, goal) {
    const path = [];
    const visited = new Array(rows * cols).fill(false);
    
    function findPath(current, steps) {
        const [row, col] = current;
        const index = row * cols + col;
        
        if (row === goal.row && col === goal.col) {
            path.push(...steps, [row, col]);
            return true;
        }
        
        if (row < 0 || row >= rows || col < 0 || col >= cols || 
            visited[index] || container.children[index].classList.contains('wall')) {
            return false;
        }
        
        visited[index] = true;
        steps.push([row, col]);
        
        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        for (const [dr, dc] of directions) {
            if (findPath([row + dr, col + dc], steps)) {
                return true;
            }
        }
        
        steps.pop();
        return false;
    }
    
    findPath([start.row, start.col], []);
    return path;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}