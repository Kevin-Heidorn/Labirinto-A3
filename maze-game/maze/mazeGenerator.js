export function initializeMaze(container, rows, cols) {
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, 20px)`;
    container.style.gridTemplateRows = `repeat(${rows}, 20px)`;

    // Cria todas as células como paredes
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('wall');
        container.appendChild(cell);
    }
}

export function generateMaze(container, rows, cols) {
    // Passo 1: Criar estrutura básica
    initializeMaze(container, rows, cols);
    
    // Passo 2: Gerar labirinto com backtracking a partir do canto superior esquerdo
    carvePassage(container, 0, 0, rows, cols);
    
    // Passo 3: Definir entrada e saída
    setEntryAndExit(container, rows, cols);
    
    // Retorna posições importantes
    return {
        start: { row: 0, col: 0 },
        goal: { row: rows - 1, col: cols - 1 }
    };
}

function carvePassage(container, row, col, rows, cols) {
    // Marca a célula atual como caminho
    const index = row * cols + col;
    container.children[index].classList.remove('wall');
    container.children[index].classList.add('path');

    // Embaralha as direções
    const directions = shuffleDirections();
    
    // Tenta mover em todas as direções
    for (const dir of directions) {
        const newRow = row + dir.row * 2;
        const newCol = col + dir.col * 2;
        
        if (isValid(newRow, newCol, rows, cols, container)) {
            // Remove a parede entre a célula atual e a nova
            const betweenRow = row + dir.row;
            const betweenCol = col + dir.col;
            const betweenIndex = betweenRow * cols + betweenCol;
            container.children[betweenIndex].classList.remove('wall');
            container.children[betweenIndex].classList.add('path');
            
            // Continua a partir da nova célula
            carvePassage(container, newRow, newCol, rows, cols);
        }
    }
}

function setEntryAndExit(container, rows, cols) {
    // Entrada (canto superior esquerdo)
    container.children[0].classList.remove('wall');
    container.children[0].classList.add('path', 'start');
    
    // Saída (canto inferior direito)
    const exitIndex = (rows - 1) * cols + (cols - 1);
    container.children[exitIndex].classList.remove('wall');
    container.children[exitIndex].classList.add('path', 'goal');
}

function shuffleDirections() {
    const directions = [
        { row: -1, col: 0 }, // Cima
        { row: 1, col: 0 },  // Baixo
        { row: 0, col: -1 }, // Esquerda
        { row: 0, col: 1 }   // Direita
    ];
    
    // Embaralha usando Fisher-Yates
    for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
    }
    
    return directions;
}

function isValid(row, col, rows, cols, container) {
    // Verifica se está dentro dos limites
    if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
    
    // Verifica se ainda é uma parede (não visitada)
    const index = row * cols + col;
    return container.children[index].classList.contains('wall');
}