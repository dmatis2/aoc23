const text = await Deno.readTextFile('input.txt')

enum DIRECTION {
    NORTH,
    EAST,
    SOUTH,
    WEST
};

const DIFFS = {
    [DIRECTION.NORTH]: [-1, 0],
    [DIRECTION.SOUTH]: [1, 0],
    [DIRECTION.WEST]: [0, -1],
    [DIRECTION.EAST]: [0, 1],
}

const DIRECTIONS = {
    '|': [DIRECTION.NORTH, DIRECTION.SOUTH],
    '-': [DIRECTION.WEST, DIRECTION.EAST],
    'L': [DIRECTION.NORTH, DIRECTION.EAST],
    'J': [DIRECTION.NORTH, DIRECTION.WEST],
    '7': [DIRECTION.WEST, DIRECTION.SOUTH],
    'F': [DIRECTION.EAST, DIRECTION.SOUTH],
    'S': [DIRECTION.NORTH, DIRECTION.SOUTH, DIRECTION.EAST, DIRECTION.WEST]
}

const VALID = {
    [DIRECTION.NORTH]: ['|', '7', 'F'],
    [DIRECTION.SOUTH]: ['|', 'L', 'J'],
    [DIRECTION.WEST]: ['-', 'L', 'F'],
    [DIRECTION.EAST]: ['-', 'J', '7']
}

const getKey = (row: number, col: number) => {
    return JSON.stringify([row, col]);
}

let startPosition: [number, number] = [0, 0];
const parsed = text
    .split('\n')
    .map(line => line.split(''))

parsed
    .forEach((line, row) => line.forEach((ch, col) => {
        if(ch === 'S') {
            startPosition = [row, col];
        }
    }))

const queue: [[number, number], number][] = [[startPosition, 0]]
const visited = new Set();
const finalDistances = new Map();

let [minRow, maxRow] = [Infinity, -Infinity];
let [minCol, maxCol] = [Infinity, -Infinity];

while(queue.length > 0) {
    const [[row, col], dist] = queue.shift();
    if(row < minRow) minRow = row;
    if(row > maxRow) maxRow = row;
    if(col < minCol) minCol = col;
    if(col > maxCol) maxCol = col;
    const key = getKey(row, col);
    const minDist = finalDistances.has(key) ? Math.min(finalDistances.get(key), dist) : dist;
    finalDistances.set(key, minDist);
    if(visited.has(key)) continue;
    visited.add(key);
    const cur = parsed[row][col];
    const next = DIRECTIONS[cur].filter(d => {
        const [dy, dx] = DIFFS[d];
        const nextY = row + dy;
        const nextX = col + dx;
        const nextChar = parsed[nextY][nextX];
        if(nextY < 0 || nextY >= parsed.length) return false;
        if(nextX < 0 || nextX >= parsed[0].length) return false;
        return VALID[d].includes(nextChar)
    }).map((d) => {
        const [dy, dx] = DIFFS[d];
        const nextY = row + dy;
        const nextX = col + dx;
        return [nextY, nextX];
    })
    queue.push(...next.map(n => [n, dist + 1]))
}

const part1 = Math.max(...finalDistances.values())

let part2 = 0;
for(let r = minRow; r <= maxRow; r++) {
    for(let c = minCol; c <= maxCol; c++) {
        if(visited.has(getKey(r,c))) continue;
        let crossings = 0;
        for(let c1 = c; c1 >= minCol; c1--) {
            if(!visited.has(getKey(r, c1))) continue;
            if(['|', 'J', 'L'].includes(parsed[r][c1])) {
                crossings++;
            }
        }
        if(crossings % 2 === 1) part2++;
    }
}

console.log(part1)
console.log(part2);
