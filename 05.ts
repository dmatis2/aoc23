const text = await Deno.readTextFile('input.txt')

let seeds = [];
let mappers = [];

text
    .split('\n\n')
    .map(map => map.split('\n'))
    .forEach((section: string[]) => {
        if(section[0].startsWith('seeds:')) {
            seeds = section[0].split(': ')[1].split(' ').map(n => parseInt(n))
            return;
        }
        mappers.push(section.slice(1).map(s => s.split(' ').map(n => parseInt(n))).toSorted((a,b) => a[1] - b[1]));
    })

const getLoc = (seed: number) => {
    let curVal = seed;
    for(let i = 0; i < mappers.length; i++) {
        const fromRanges = mappers[i].map(r => [r[1], r[1] + r[2] - 1])
        const toRanges = mappers[i].map(r => [r[0], r[0] + r[2] - 1])
        for(let j = 0; j < fromRanges.length; j++) {
            if(curVal >= fromRanges[j][0] && curVal <= fromRanges[j][1]) {
                curVal = toRanges[j][0] + (curVal - fromRanges[j][0])
                break;
            }
        }
    }
    return curVal;
}

const part1 = Math.min(...seeds.map(getLoc))
console.log(part1)

let part2 = -1;
let seedRanges = [];
for(let i = 0; i < seeds.length; i += 2) {
    seedRanges.push([seeds[i], seeds[i] + seeds[i + 1] - 1])
}

for(let i = 0; i < Number.MAX_VALUE; i++) {
    let curVal = i;
    for(let r = mappers.length - 1; r >= 0; r--) {
        for(let j = 0; j < mappers[r].length; j++) {
            const [dest, src, size] = mappers[r][j];
            const end = src + size - 1;
            const diff = dest - src;
            if(src <= (curVal - diff) && (curVal - diff) <= end) {
                curVal = curVal - dest + src
                break;
            }
        }
    }

    if(seedRanges.some(r => r[0] <= curVal && curVal <= r[1])) {
        part2 = i;
        break;
    }
}
console.log(part2);