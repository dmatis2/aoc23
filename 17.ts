const text = await Deno.readTextFile('input.txt')

const DIRS = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1]
]

const parsed = text
    .split('\n')
    .map(line => line.split('').map(x => parseInt(x)))

const ROWS = parsed.length;
const COLS = parsed[0].length;

const solvePart1 = () => {
    let queue = [[0,0,0,0,0,0]];
    let visited = new Set<string>();

    while(queue.length > 0) {
        const [r, c, count, sum, dirR, dirC] = queue.shift()!;
        if(r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
        if(r === ROWS - 1 && c === COLS - 1) {
            return sum;
        }
        const key = `${r},${c},${count},${dirR},${dirC}`;
        if(visited.has(key)) continue;
        visited.add(key);

        if(count < 3 && (dirR !== 0 || dirC !== 0)) {
            const newR = r + dirR
            const newC = c + dirC
            if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS) {
                queue.push([newR, newC, count + 1, sum + parsed[newR][newC], dirR, dirC])
            }
        }

        DIRS.forEach(d => {
            if((d[0] !== dirR || d[1] !== dirC) && (d[0] !== -dirR || d[1] !== -dirC)) {
                const newR = r + d[0]
                const newC = c + d[1]
                if(newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS) {
                    queue.push([newR, newC, 1, sum + parsed[newR][newC], d[0], d[1]])
                }
            }
        })

        queue = queue.toSorted((a,b) => a[3] - b[3])
    }

    return -1;
}

const solvePart2 = () => {
    let queue = [[0,0,0,0,0,0]];
    let visited = new Set<string>();

    while(queue.length > 0) {
        const [r, c, count, sum, dirR, dirC] = queue.shift()!;
        if(r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
        if(r === ROWS - 1 && c === COLS - 1 && count >= 4) {
            return sum;
        }
        const key = `${r},${c},${count},${dirR},${dirC}`;
        if(visited.has(key)) continue;
        visited.add(key);

        if(count < 10 && (dirR !== 0 || dirC !== 0)) {
            const newR = r + dirR
            const newC = c + dirC
            if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS) {
                queue.push([newR, newC, count + 1, sum + parsed[newR][newC], dirR, dirC])
            }
        }

        if(count >= 4 || (dirR === 0 && dirC === 0)) {
            DIRS.forEach(d => {
                if((d[0] !== dirR || d[1] !== dirC) && (d[0] !== -dirR || d[1] !== -dirC)) {
                    const newR = r + d[0]
                    const newC = c + d[1]
                    if(newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS) {
                        queue.push([newR, newC, 1, sum + parsed[newR][newC], d[0], d[1]])
                    }
                }
            })
        }


        queue = queue.toSorted((a,b) => a[3] - b[3])
    }
    return -1;
}

console.log(solvePart1())
console.log(solvePart2())