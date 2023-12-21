const text = await Deno.readTextFile('input.txt')

const DIRS = {
    'U': [-1, 0],
    'R': [0, 1],
    'D': [1, 0],
    'L': [0, -1]
}

let start: [number, number] = [0, 0]

const parsed = text
    .split('\n')
    .map((line, row) => {
        if(line.includes('S')) start = [row, line.indexOf('S')]
        return line.split('')
    })

const ROWS = parsed.length;
const COLS = parsed[0].length;
const getNeighbors = (row: number, col: number) => {
    let positions: [number, number][] = [];
    Object.keys(DIRS)
        .forEach(key => {
            const r = row + DIRS[key][0]
            const c = col + DIRS[key][1]
            if(r < 0 || r >= ROWS || c < 0 || c >= COLS || parsed[r][c] !== '.') return;
            positions.push([r, c])
        })
    return positions;
}

const bfs = (maxSteps = null) => {
    // BFS again
    let queue: [[number, number], number][] = [[start, 0]]
    let visited: [number, number][] = [start]
    let solution: [number, number][] = [];
    let oddSolution: [number, number][] = [];
    while(queue.length > 0) {
        const [[r, c], dist] = queue.shift()!;
        if(dist % 2 === 0) {
            solution.push([r, c])
        } else {
            oddSolution.push([r, c])
        }
        if(maxSteps && maxSteps === dist) {
            continue;
        }

        let neighbors = getNeighbors(r, c);
        neighbors = neighbors.filter(n => visited.every(v => v[0] !== n[0] || v[1] !== n[1]))
        neighbors.forEach(n => {
            visited.push(n)
            queue.push([n, dist + 1])
        })
    }

    return [solution.length, oddSolution.length];
}

const part1 = bfs(64)[0];
console.log(part1)

const [maxEven, maxOdd] = bfs(65);

const [allEven, allOdd] = bfs();

const evenCornersRemaining = allEven - maxEven;
const oddCornersRemaining = allOdd - maxOdd;

const n = 202300;

const part2 = (n + 1)**2 * allOdd
    + n**2 * allEven
    + n * evenCornersRemaining
    - (n + 1) * oddCornersRemaining

console.log(part2)



