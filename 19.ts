const text = await Deno.readTextFile('input.txt')

const [workflows, _ratings] = text
    .split('\n\n')
    .map(part => part.split('\n'))

const workflowMap = new Map<string, string[]>();
const ratings: Record<string, number>[] = [];

workflows.forEach(w => {
    const {name, content} = w.match(/^(?<name>[a-z]+)\{(?<content>.+)\}$/)!.groups!
    workflowMap.set(name, content.split(','))
})

_ratings.forEach(r => {
    ratings.push(JSON.parse(r.replace(/([xmas])=/g,'"$1":')))
})

const processRating = (rating: Record<string, number>, key: string): boolean => {
    const workflow = workflowMap.get(key)!
    const {x, m, a, s} = rating;
    for(let i = 0; i < workflow.length; i++) {
        if(workflow[i] === 'A') return true;
        if(workflow[i] === 'R') return false;
        if(workflow[i].includes(':')) {
            const [cond, jump] = workflow[i].split(':')
            if(!eval(cond)) {
                continue;
            }
            if(jump === 'A') return true;
            if(jump === 'R') return false;
            return processRating(rating, jump);
        }
        return processRating(rating, workflow[i]);
    }
    return false;
}

const getCount = (ranges: any, key: string, index: number) => {
    if(key === 'A') {
        return ranges.reduce((acc, v) => acc * (v[1] - v[0] + 1), 1)
    }
    if(key === 'R') {
        return 0;
    }
    const w = workflowMap.get(key)!;
    const curr = w[index];
    let currTotal = 0;

    if(index === w.length - 1) {
        currTotal += getCount(structuredClone(ranges), curr, 0);
        return currTotal;
    }

    const { l, op, num, next } = curr
        .match(/(?<l>[xmas])(?<op>\<|\>)(?<num>\d+):(?<next>[a-zA-Z]+)/)!.groups!;
    const oldRange = ranges['xmas'.indexOf(l)];
    let newRangeTrue = [0, 0];
    let newRangeFalse = [0, 0];
    if(op === '<') {
        newRangeTrue = [oldRange[0], parseInt(num) - 1]
        newRangeFalse = [parseInt(num), oldRange[1]]
    } else {
        newRangeTrue = [parseInt(num) + 1, oldRange[1]]
        newRangeFalse = [oldRange[0], parseInt(num)]
    }
    if(newRangeTrue[0] <= newRangeTrue[1]) {
        const newRange = structuredClone(ranges)
        newRange['xmas'.indexOf(l)] = newRangeTrue;
        currTotal += getCount(newRange, next, 0);
    }
    if(newRangeFalse[0] <= newRangeFalse[1]) {
        const newRange = structuredClone(ranges)
        newRange['xmas'.indexOf(l)] = newRangeFalse;
        currTotal += getCount(newRange, key, index + 1);
    }
    return currTotal;
}

const part1 = ratings.reduce((acc, r) => {
    if(processRating(r, 'in')) {
        return acc + Object.values(r).reduce((a, v) => a + v, 0);
    }
    return acc;
}, 0)

console.log(part1)

const ranges = Array(4).fill(0).map(_ => [1, 4000])
const part2 = getCount(ranges, 'in', 0);
console.log(part2);
