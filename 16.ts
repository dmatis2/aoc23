const text = await Deno.readTextFile('input.txt')

const parsed = text
    .split('\n')
    .map(line => line.split(''))

const rows = parsed.length
const cols = parsed[0].length

const getEnergizedTiles = (beams: [[number, number], number][]) => {
    let newBeams = [];
    let visited = new Set<string>();
    let visitedMap = new Map<string, number>();

    while(true) {
        newBeams = [];
        beams.forEach(beam => {
            const key = JSON.stringify(beam);
            const posKey = JSON.stringify(beam[0]);
            if(visited.has(key)) {
                visitedMap.set(posKey, visitedMap.get(posKey)! + 1);
                return;
            }

            const [r, c] = beam[0]
            const dir = beam[1]

            if(r < 0 || r >= rows) return;
            if(c < 0 || c >= cols) return;

            visitedMap.set(posKey, 1);
            visited.add(key)

            if([1,3].includes(dir) && parsed[r][c] === '|') {
                newBeams.push([[r - 1, c], 0])
                newBeams.push([[r + 1, c], 2])
                return;
            }
            else if([0,2].includes(dir) && parsed[r][c] === '-') {
                newBeams.push([[r, c - 1], 3])
                newBeams.push([[r, c + 1], 1])
                return;
            }
            else if(parsed[r][c] === '\\') {
                if(dir === 0) {
                    newBeams.push([[r, c - 1], 3])
                }
                if(dir === 1) {
                    newBeams.push([[r + 1, c], 2])
                }
                if(dir === 2) {
                    newBeams.push([[r, c + 1], 1])
                }
                if(dir === 3) {
                    newBeams.push([[r - 1, c], 0])
                }
                return;
            }
            else if(parsed[r][c] === '/') {
                if(dir === 0) {
                    newBeams.push([[r, c + 1], 1])
                }
                if(dir === 1) {
                    newBeams.push([[r - 1, c], 0])
                }
                if(dir === 2) {
                    newBeams.push([[r, c - 1], 3])
                }
                if(dir === 3) {
                    newBeams.push([[r + 1, c], 2])
                }
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
            beams = structuredClone(newBeams);
            continue;
        }
        break;
    }

    return visitedMap.size;
}

const solvePart2 = () => {
    let max = -Infinity;
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < cols; c++) {
            if(r === 0) {
                const tmp = getEnergizedTiles([[[r, c], 2]])
                if(tmp > max) max = tmp;
            }
            if(c === 0) {
                const tmp = getEnergizedTiles([[[r, c], 1]])
                if(tmp > max) max = tmp;
            }
            if(r === rows - 1) {
                const tmp = getEnergizedTiles([[[r, c], 0]])
                if(tmp > max) max = tmp;
            }
            if(c === cols - 1) {
                const tmp = getEnergizedTiles([[[r, c], 3]])
                if(tmp > max) max = tmp;
            }
        }
    }
    return max;
}

const part1 = getEnergizedTiles([[[0, 0], 1]])
const part2 = solvePart2();

console.log(part1)
console.log(part2)
