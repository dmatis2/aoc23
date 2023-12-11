const text = await Deno.readTextFile('input.txt')

const parsed = text
    .split('\n')
let emptyRows = Array(parsed.length).fill(0).map((_, i) => i);
let emptyCols = Array(parsed[0].length).fill(0).map((_, i) => i);
let galaxies = []

parsed
    .forEach((line, row) => line.split('').forEach((ch, col) => {
        if(ch === '#') {
            galaxies.push([row, col])
            emptyRows = emptyRows.filter(rr => rr !== row)
            emptyCols = emptyCols.filter(cc => cc !== col)
        }
    }))

const expandGalaxy = (galaxies: [number, number][], isPart2: boolean) => {
    const diff = isPart2 ? (1e6 - 1) : 1
    return galaxies.map(g => {
        const newRow = g[0] + diff * emptyRows.filter(r => r <= g[0]).length
        const newCol = g[1] + diff * emptyCols.filter(c => c <= g[1]).length
        return [newRow, newCol]
    })
}

const solve = (isPart2: boolean) => {
    let solution = 0;
    let expandedGalaxies = expandGalaxy(galaxies, isPart2);
    for(let i = 0; i < expandedGalaxies.length - 1; i++) {
        for(let j = i + 1; j < expandedGalaxies.length; j++) {
            solution += Math.abs(expandedGalaxies[j][0] - expandedGalaxies[i][0]) + Math.abs(expandedGalaxies[j][1] - expandedGalaxies[i][1])
        }
    }
    return solution;
}

console.log(solve(false))
console.log(solve(true))
