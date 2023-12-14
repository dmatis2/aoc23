const text = await Deno.readTextFile('input.txt')

const parsed: string[][] = text
    .split('\n')
    .map(line => line.split(''))

const rollToNorth = (grid: string[][]) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const newGrid = structuredClone(grid);

    for(let c = 0; c < cols; c++) {
        for(let r = 1; r < rows; r++) {
            if(newGrid[r][c] === 'O') {
                let newRow = r;
                for(let r2 = r - 1; r2 >= 0; r2--) {
                    if(newGrid[r2][c] === '.') {
                        newRow = r2;
                    }
                    if(newGrid[r2][c] === '#') {
                        break;
                    }
                }
                if(newRow !== r) {
                    newGrid[newRow][c] = 'O'
                    newGrid[r][c] = '.'
                }
            }
        }
    }
    return newGrid;
}

const rollToSouth = (grid: string[][]) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const newGrid = structuredClone(grid);

    for(let c = 0; c < cols; c++) {
        for(let r = rows - 1; r >= 0; r--) {
            if(newGrid[r][c] === 'O') {
                let newRow = r;
                for(let r2 = r + 1; r2 < rows; r2++) {
                    if(newGrid[r2][c] === '.') {
                        newRow = r2;
                    }
                    if(newGrid[r2][c] === '#') {
                        break;
                    }
                }
                if(newRow !== r) {
                    newGrid[newRow][c] = 'O'
                    newGrid[r][c] = '.'
                }
            }
        }
    }
    return newGrid;
}

const rollToEast = (grid: string[][]) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const newGrid = structuredClone(grid);

    for(let r = 0; r < rows; r++) {
        for(let c = cols - 1; c >= 0; c--) {
            if(newGrid[r][c] === 'O') {
                let newCol = c;
                for(let c2 = c + 1; c2 < rows; c2++) {
                    if(newGrid[r][c2] === '.') {
                        newCol = c2;
                    }
                    if(newGrid[r][c2] === '#') {
                        break;
                    }
                }
                if(newCol !== c) {
                    newGrid[r][newCol] = 'O'
                    newGrid[r][c] = '.'
                }
            }
        }
    }
    return newGrid;
}

const rollToWest = (grid: string[][]) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const newGrid = structuredClone(grid);

    for(let r = 0; r < rows; r++) {
        for(let c = 1; c < cols; c++) {
            if(newGrid[r][c] === 'O') {
                let newCol = c;
                for(let c2 = c - 1; c2 >= 0; c2--) {
                    if(newGrid[r][c2] === '.') {
                        newCol = c2;
                    }
                    if(newGrid[r][c2] === '#') {
                        break;
                    }
                }
                if(newCol !== c) {
                    newGrid[r][newCol] = 'O'
                    newGrid[r][c] = '.'
                }
            }
        }
    }
    return newGrid;
}

const doCycle = (grid: string[][]) => {
    return rollToEast(rollToSouth(rollToWest(rollToNorth(grid))));
}

const getLoad = (grid: string[][]) => {
    const rows = grid.length;
    const cols = grid[0].length;
    let load = 0;

    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < rows; c++) {
            if(grid[r][c] === 'O') {
                load += rows - r;
            }
        }
    }

    return load;
}

const getKey = (grid: string[][]) => {
    return grid.map(l => l.join('')).join('')
}

const solvePart1 = (grid: string[][]) => {
    return getLoad(rollToNorth(grid));
}

const solvePart2 = (grid: string[][]) => {
    let calculatedGrids = new Map();
    let indexToCache = new Map();
    let cycled = grid;
    let solution = -Infinity;
    for(let i = 0; i < 1e9; i++) {
        cycled = doCycle(cycled);
        const key = getKey(cycled);
        if(indexToCache.has(key)) {
            const index = indexToCache.get(key);
            const modulo = i - index;
            solution = getLoad(calculatedGrids.get((1e9 - index - 1) % modulo + index));
            break;
        }

        indexToCache.set(key, i);
        calculatedGrids.set(i, structuredClone(cycled))
    }
    return solution;
}

console.log(solvePart1(structuredClone(parsed)));
console.log(solvePart2(structuredClone(parsed)));
