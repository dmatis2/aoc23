const text = await Deno.readTextFile('input.txt')

const D = {
    '\\': [
        [0,1,0,-1],
        [-1,0,1,0]
    ],
    '/': [
        [0,-1,0,1],
        [1,0,-1,0]
    ]
}

const parsed = text
    .split('\n')
    .map(line => line.split(''))

const rows = parsed.length
const cols = parsed[0].length

const getEnergizedTiles = (beams: [[number, number], number][]) => {
    let newBeams = [];
    const visited = new Set<string>();
    const visitedMap = new Map<string, number>();

    while(true) {
        newBeams = [];
        beams.forEach(beam => {
            const key = `${beam[0][0]},${beam[0][1]},${beam[1]}`
            const posKey = `${beam[0][0]},${beam[0][1]}`
            if(visited.has(key)) {
                return;
            }

            const [[r, c], dir] = beam;

            if(r < 0 || r >= rows) return;
            if(c < 0 || c >= cols) return;

            const ch = parsed[r][c];

            visitedMap.set(posKey, 1);
            visited.add(key)

            if((dir%2 === 1) && ch === '|') {
                newBeams.push([[r - 1, c], 0])
                newBeams.push([[r + 1, c], 2])
                return;
            }
            else if((dir% 2 === 0) && ch === '-') {
                newBeams.push([[r, c - 1], 3])
                newBeams.push([[r, c + 1], 1])
                return;
            }
            else if(ch === '/' || ch === '\\') {
                const newR = r + D[ch][0][dir]
                const newC = c + D[ch][1][dir]
                const newD = ch === '/' ? (5 - dir) % 4 : 3 - dir;
                if(newR < 0 || newR >= rows) return;
                if(newC < 0 || newC >= cols) return;
                newBeams.push([[newR, newC], newD])
                return;
            } else {
                if(dir === 0) {
                    newBeams.push([[r - 1, c], 0])
                }
                if(dir === 1) {
                    newBeams.push([[r, c + 1], 1])
                }
                if(dir === 2) {
                    newBeams.push([[r + 1, c], 2])
                }
                if(dir === 3) {
                    newBeams.push([[r, c - 1], 3])
                }
            }
        })
        if(JSON.stringify(beams) !== JSON.stringify(newBeams)) {
            beams = newBeams;
            continue;
        }
        break;
    }

    return visitedMap.size;
}

const solvePart2 = () => {
    let max = -Infinity;
    for(let r = 0; r < rows; r++) {
        max = Math.max(
            max,
            getEnergizedTiles([[[r, 0], 1]]),
            getEnergizedTiles([[[r, cols - 1], 3]])
        )
    }
    for(let c = 0; c < cols; c++) {
        max = Math.max(
            max,
            getEnergizedTiles([[[0, c], 2]]),
            getEnergizedTiles([[[rows - 1, c], 0]])
        )
    }

    return max;
}

const part1 = getEnergizedTiles([[[0, 0], 1]])
const part2 = solvePart2();

console.log(part1)
console.log(part2)
