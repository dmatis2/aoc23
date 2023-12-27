const text = await Deno.readTextFile('input.txt')

type Hailstone = [[number, number, number],[number, number, number]]

const parsed = text
    .split('\n')
    .map(line => line
        .split(' @ ')
        .map(part => part
            .split(', ')
            .map(num => parseInt(num)))) as Hailstone[]

const getLinear = (line: Hailstone) => {
    let m = line[1][0] >= 0 ? line[1][1] / line[1][0] : line[1][1] / (-line[1][0])
    if(line[1][0] < 0) m = -m
    const tmpSum = m * line[0][0] - line[0][1]
    return (x: number) => {
        return x*m - tmpSum;
    }
}

const getCompar = (line1: Hailstone, line2: Hailstone) => {
    const m1 = line1[1][1] / line1[1][0]
    const m2 = line2[1][1] / line2[1][0]
    return (line1[0][1] - line2[0][1] - m1 * line1[0][0] + m2 * line2[0][0]) / (m2 - m1)
}

let part1 = 0;
parsed.forEach((line1: Hailstone, i) => {
    parsed.forEach((line2: Hailstone, i2) => {
        if(i2 <= i) return;
        const x = getCompar(line1, line2)
        const y = getLinear(line1)(x)
        const diff = x - line1[0][0]
        const diff2 = x - line2[0][0]
        const isInPast = ((diff / line1[1][0]) < 0) || ((diff2 / line2[1][0]) < 0)
        if(x >= 2e14 && x <= 4e14 && y >= 2e14 && y <= 4e14 && !isInPast) {
            part1++;
        }
    })
})

console.log(part1);
