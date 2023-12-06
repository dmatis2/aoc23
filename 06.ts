const text = await Deno.readTextFile('input.txt')

const parsed = text
    .split('\n')
    .map(line => line.split(':')[1].trim())
    .map(nums => nums.split(/ +/).map(num => parseInt(num)))

const parsedPart2 = text
    .split('\n')
    .map(line => parseInt(line.split(':')[1].replace(/ /g, '')))

const totalDistance = (timeHolding: number, totalDuration: number) => {
    return (totalDuration - timeHolding) * timeHolding;
}

const part1 = parsed[0].map((t: number) => Array(t)
    .fill(0)
    .map((_,t1: number) => totalDistance(t1, t)))
    .map((race: number[], i: number) => race.filter(d => d > parsed[1][i]))
    .reduce((acc: number, v: number[]) => acc * v.length, 1)
console.log(part1)

let part2 = 0;
for(let i = 0; i <= parsedPart2[0]; i++) {
    const d = totalDistance(i, parsedPart2[0])
    if(d > parsedPart2[1]) {
        part2++;
    }
}
console.log(part2)
