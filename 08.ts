const text = await Deno.readTextFile('input.txt')

const map = new Map<string, string[]>();
let instructions = '';
text
    .split('\n\n')
    .forEach((line, i) => {
        if(i === 0) instructions = line
        else {
            line
                .split('\n')
                .forEach(l => {
                    const { from, left, right } = l.match(/(?<from>\w{3}) = \((?<left>\w{3}), (?<right>\w{3})\)/).groups;
                    map.set(from, [left, right])
                })
        }
    })

const getNextPosition = (currentPosition: string, currentCount: number) => {
    return map.get(currentPosition)[instructions[currentCount % instructions.length] === 'L' ? 0 : 1];
}

const gcd = (a: number, b: number): number => {
    // Euclidean algorithm
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
};

const lcm = (a: number, b: number): number => {
    return (a * b) / gcd(a, b);
};

const lcmm = (nums: number[]): number => {
    let res = nums[0];
    for(let i = 1; i < nums.length; i++) {
        res = lcm(res, nums[i]);
    }
    return res;
}

const solvePart1 = () => {
    let curPos = 'AAA';
    let count = 0;

    while(curPos !== 'ZZZ') {
        curPos = getNextPosition(curPos, count);
        count++;
    }

    return count;
}

const solvePart2 = () => {
    let startingPoints = [...map.keys()].filter(k => k.endsWith('A'));
    let periods = startingPoints.map(_ => 0)
    let count = 0;
    while(!periods.every(n => n !== 0)) {
        startingPoints = startingPoints.map(k => getNextPosition(k, count));
        startingPoints.forEach((k, i) => {
            if(k.endsWith('Z') && periods[i] === 0) periods[i] = count;
        })
        count++;
    }
    periods = periods.map(n => n + 1)
    return lcmm(periods);
}


const part1 = solvePart1();
const part2 = solvePart2();
console.log(part1)
console.log(part2)
