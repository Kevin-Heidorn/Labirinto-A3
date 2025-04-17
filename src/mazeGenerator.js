export function createMazeStructure(container, rows, cols) {
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, 20px)`;
    container.style.gridTemplateRows = `repeat(${rows}, 20px)`;

    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('wall');
        container.appendChild(cell);
    }
}

export function generateMazeWithBacktracking(container, row, col, rows, cols) {
    const index = row * cols + col;
    container.children[index].classList.remove('wall');

    const directions = shuffle([
        { row: -1, col: 0 }, { row: 1, col: 0 },
        { row: 0, col: -1 }, { row: 0, col: 1 }
    ]);

    for (let dir of directions) {
        const newRow = row + dir.row * 2;
        const newCol = col + dir.col * 2;
        if (isValid(newRow, newCol, container, rows, cols)) {
            const betweenIndex = (row + dir.row) * cols + (col + dir.col);
            container.children[betweenIndex].classList.remove('wall');
            generateMazeWithBacktracking(container, newRow, newCol, rows, cols);
        }
    }
}

function isValid(row, col, container, rows, cols) {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
    const index = row * cols + col;
    return container.children[index].classList.contains('wall');
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}
