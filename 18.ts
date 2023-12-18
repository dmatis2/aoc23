const text = await Deno.readTextFile('input.txt')

const DIRS = {
    'U': [-1, 0],
    'R': [0, 1],
    'D': [1, 0],
    'L': [0, -1]
}

const parsed: [string, string, string][] = text
    .split('\n')
    .map(line => line.split(' '))

const parsedPart2 = parsed.map(line => {
    const dir = "RDLU"[line[2].at(-2)]
    const val = parseInt(line[2].replace(/\(#|.\)/g, ''), 16)
    return [dir, val];
})

// New skill aquired, shoelace formula <3
const getShoelaceValue = (lines: [string, string, string][]) => {
    let perimeter = 0;
    let edges = [[0, 0]]
    let cur = [0, 0]

    lines.forEach(line => {
        const [dir, count, _color] = line;
        const r = cur[0] + parseInt(count) * DIRS[dir][0]
        const c = cur[1] + parseInt(count) * DIRS[dir][1]
        cur = [r, c]
        edges.push(cur);
        perimeter += parseInt(count);
    })

    let sum = 0;

    for(let i = 0; i < edges.length; i++) {
        const nextI = (i + 1) % edges.length;
        sum += (edges[i][1] * edges[nextI][0]) - (edges[nextI][1] * edges[i][0])
    }

    return (sum + perimeter) / 2 + 1;
}




const part1 = getShoelaceValue(parsed);
const part2 = getShoelaceValue(parsedPart2);

console.log(part1);
console.log(part2);