const text = await Deno.readTextFile('input.txt')

const parsed = text
    .split('\n')
    .map(line => line.split(' '))
    .map(line => [line[0], line[1].split(',').map(n => parseInt(n))])

const getExpanded = (line) => {
    const grid = Array(5).fill(0).map(_ => line[0]).join('?')
    const blocks = Array(5).fill(0).flatMap(_ => line[1])
    return [grid, blocks];
}

const cache = new Map();
const bruteforce = (isPart2, grid, counts, gridIdx = 0, countsIdx = 0, currentLength = 0) => {
    const key = JSON.stringify([gridIdx, countsIdx, currentLength])
    if(cache.has(key)) return cache.get(key);

    if(gridIdx === grid.length) {
        if(countsIdx === counts.length && currentLength === 0) {
            return 1;
        }
        else if(countsIdx === (counts.length - 1) && counts[countsIdx] === currentLength) {
            return 1;
        }
        else {
            return 0;
        }
    }

    let total = 0;

    ['.', '#'].forEach((ch) => {
        if(grid[gridIdx] === ch || grid[gridIdx] === '?') {
            if(currentLength === 0 && ch === '.') {
                total += bruteforce(isPart2, grid, counts, gridIdx + 1, countsIdx, 0);
            }
            else if(currentLength > 0 && ch === '.' && counts[countsIdx] === currentLength && countsIdx < counts.length) {
                total += bruteforce(isPart2, grid, counts, gridIdx + 1, countsIdx + 1, 0);
            }
            else if(ch === '#') {
                total += bruteforce(isPart2, grid, counts, gridIdx + 1, countsIdx, currentLength + 1)
            }
        }

    })
    if(isPart2) cache.set(key, total);
    return total;
}

const part1 = parsed.reduce((acc, [grid, counts]) => acc + bruteforce(false, grid, counts), 0)

const part2 = parsed
    .map(line => getExpanded(line))
    .reduce((acc, [grid, counts]) => {
        const value = acc + bruteforce(true, grid, counts);
        cache.clear();
        return value;
    }, 0)

console.log(part1)
console.log(part2);
