const text = await Deno.readTextFile('input.txt')

const DIRS = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1]
]

const SLOPES = {
    '^': [-1, 0],
    '>': [0, 1],
    'v': [1, 0],
    '<': [0, -1]
}

const parsed = text
    .split('\n')
    .map(line => line.split(''))

const ROWS = parsed.length
const COLS = parsed[0].length
const start: [number, number] = [0, text.indexOf('.')]
const end: [number, number] = [ROWS - 1, parsed[ROWS - 1].indexOf('.')]
const stepsToPos = new Map<string, number>();
stepsToPos.set(`${start[0]},${start[1]}`, 0);

const bfs = (isPart2 = false) => {
    const crossings: [number, number][] = [];
    crossings.push(start)
    crossings.push(end)

    // get the crossings
    for(let r = 0; r < ROWS; r++) {
        for(let c = 0; c < COLS; c++) {
            if(parsed[r][c] === '#') continue;
            let neighborsCount = 0;
            DIRS.forEach(([dr, dc]) => {
                const rr = r + dr
                const cc = c + dc
                if(rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS || parsed[rr][cc] === '#') return;
                neighborsCount++;
            })
            if(neighborsCount >= 3 && crossings.some(cr => cr[0] !== r || cr[1] !== c)) {
                crossings.push([r, c]);
            }
        }
    }

    // do BFS to get all edges
    const edges = new Map<string, [number, number, number][]>();
    //
    crossings.forEach(([r, c]) => {
        const visited = new Set<string>();
        const queue = [[r, c, 0]]
        const key = `${r},${c}`
        edges.set(key, [])

        while(queue.length > 0) {
            const [rr, cc, d] = queue.shift()!;
            const key2 = `${rr},${cc}`
            if(visited.has(key2)) return;
            visited.add(key2);
            if((rr !== r || cc !== c) && crossings.find(cr => cr[0] === rr && cr[1] === cc)) {
                edges.set(key, [...edges.get(key)!, [rr, cc, d]]);
                continue;
            }
            DIRS.forEach(([dr, dc], i) => {
                const rrr = rr + dr
                const ccc = cc + dc
                if(rrr < 0 || rrr >= ROWS || ccc < 0 || ccc >= COLS || visited.has(`${rrr},${ccc}`) || parsed[rrr][ccc] === '#') {
                    return;
                }
                if(!isPart2 && parsed[rrr][ccc] !== '.' && i !== Object.keys(SLOPES).indexOf(parsed[rrr][ccc])) {
                    return;
                }
                queue.push([rrr, ccc, d + 1])
            })
        }
    })

    const visited = new Set<string>();
    let maxSteps = -Infinity;
    const dfs = ([r, c, d]: [number, number, number]) => {
        const key = `${r},${c}`
        if(visited.has(key)) return;
        visited.add(key);
        if(r === end[0] && c === end[1]) {
            maxSteps = Math.max(maxSteps, d);
        }
        const nextEdges = edges.get(key)!;
        nextEdges.forEach(edge => {
            dfs([edge[0], edge[1], edge[2] + d]);
        })
        visited.delete(key);
    }

    dfs([start[0], start[1], 0]);
    return maxSteps;
}

const part1 = bfs()
const part2 = bfs(true);

console.log(part1)
console.log(part2)