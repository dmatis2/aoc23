const text = await Deno.readTextFile('input.txt')

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
    const modulesMap = new Map<string, string[]>();
    const flipFlops: [string, number][] = [];
    const conjuctions: [string, number][] = [];
    const conjuctionParents = new Map<string, string[]>();
    const defaultState: Record<string, number> = {}
    text
        .split('\n')
        .forEach(line => {
            const [ source, destination ] = line.split(' -> ')
            const parsedSource = ['%','&'].includes(source[0]) ? source.substring(1) : source;
            modulesMap.set(parsedSource, destination.split(', '));
            if(source.startsWith('%')) flipFlops.push([parsedSource, 0]);
            if(source.startsWith('&')) conjuctions.push([parsedSource, 0]);
            defaultState[source] = 0
        })

    modulesMap.forEach((value, key) => {
        conjuctions.forEach(c => {
            if(value.includes(c[0])) {
                if(!conjuctionParents.has(c[0])) conjuctionParents.set(c[0], []);
                conjuctionParents.set(c[0], [...conjuctionParents.get(c[0])!, key])
            }
        })
    })

    const pushButton = () => {
        let counts = [0, 0];
        let queue: [string, number][] = [['broadcaster', 0]]
        while(queue.length > 0) {
            const [curr, pulse] = queue.shift()!;
            counts[pulse]++;
            // console.log(`${pulse} -> ${curr}`)
            const nextModules = modulesMap.get(curr)!;
            if(curr === 'broadcaster') {
                queue = [...queue, ...nextModules.map(m => [m, 0])]
                continue;
            }
            if(flipFlops.find(f => f[0] === curr)) {
                if(pulse === 1) {
                    continue;
                }
                const index = flipFlops.findIndex(f => f[0] === curr);
                flipFlops[index][1] = (flipFlops[index][1] + 1) % 2
                queue = [...queue, ...nextModules.map(m => [m, flipFlops[index][1]])]
                continue;
            }
            if(conjuctions.find(f => f[0] === curr)) {
                const parents = conjuctionParents.get(curr)!;
                const value = parents.reduce((acc,v) => {
                    let index = flipFlops.findIndex(f => f[0] === v);
                    if(index === -1) {
                        index = conjuctions.findIndex(f => f[0] === v);
                        return acc & conjuctions[index][1]
                    }
                    return acc & flipFlops[index][1]
                }, 1);
                const index = conjuctions.findIndex(f => f[0] === curr);
                conjuctions[index][1] = (value + 1) % 2
                queue = [...queue, ...nextModules.map(m => [m, (value + 1) % 2])]
            }
        }
        return counts;
    }

    let counts = [0, 0];
    for(let i = 0; i < 1000; i++) {
        let res = pushButton();
        counts[0] += res[0]
        counts[1] += res[1]
    }

    return counts[0] * counts[1]
}

const solvePart2 = () => {
    const modulesMap = new Map<string, string[]>();
    let flipFlops: [string, number][] = [];
    let conjuctions: [string, number][] = [];
    let conjuctionParents = new Map<string, string[]>();
    text
        .split('\n')
        .forEach(line => {
            const [ source, destination ] = line.split(' -> ')
            const parsedSource = ['%','&'].includes(source[0]) ? source.substring(1) : source;
            modulesMap.set(parsedSource, destination.split(', '));
            if(source.startsWith('%')) flipFlops.push([parsedSource, 0]);
            if(source.startsWith('&')) conjuctions.push([parsedSource, 0]);
        })

    modulesMap.forEach((value, key) => {
        conjuctions.forEach(c => {
            if(value.includes(c[0])) {
                if(!conjuctionParents.has(c[0])) conjuctionParents.set(c[0], []);
                conjuctionParents.set(c[0], [...conjuctionParents.get(c[0])!, key])
            }
        })
    })

    let hits = new Map([['xc', 0], ['th', 0], ['pd', 0], ['bp', 0]])
    const pushButtonUntilRX = () => {
        let rxLowPulseHitCount = 0;
        let counts = [0, 0];
        let queue: [string, number][] = [['broadcaster', 0]]
        while(queue.length > 0) {
            const [curr, pulse] = queue.shift()!;
            if(hits.has(curr) && pulse === 0) {
                hits.set(curr, hits.get(curr)! + 1)
            }
            counts[pulse]++;
            const nextModules = modulesMap.get(curr)!;
            if(curr === 'broadcaster') {
                queue = [...queue, ...nextModules.map(m => [m, 0])]
                continue;
            }
            if(flipFlops.find(f => f[0] === curr)) {
                if(pulse === 1) {
                    continue;
                }
                const index = flipFlops.findIndex(f => f[0] === curr);
                flipFlops[index][1] = (flipFlops[index][1] + 1) % 2
                queue = [...queue, ...nextModules.map(m => [m, flipFlops[index][1]])]
                continue;
            }
            if(conjuctions.find(f => f[0] === curr)) {
                const parents = conjuctionParents.get(curr)!;
                const value = parents.reduce((acc,v) => {
                    let index = flipFlops.findIndex(f => f[0] === v);
                    if(index === -1) {
                        index = conjuctions.findIndex(f => f[0] === v);
                        return acc & conjuctions[index][1]
                    }
                    return acc & flipFlops[index][1]
                }, 1);
                const index = conjuctions.findIndex(f => f[0] === curr);
                conjuctions[index][1] = (value + 1) % 2
                queue = [...queue, ...nextModules.map(m => [m, (value + 1) % 2])]
            }
        }
        return 0;
    }

    let pushes = 0;
    let toProcess = ['xc', 'th', 'pd', 'bp']
    const values: number[] = [];
    while(toProcess.length > 0) {
        pushes++;
        pushButtonUntilRX();
        if([...hits.values()].some(x => x > 0)) {
            let done: string[] = []
            toProcess.forEach(x => {
                if(hits.get(x)! > 0) {
                    done.push(x);
                    values.push(pushes);
                }
            })
            toProcess = toProcess.filter(x => !done.includes(x))
        }
    }

    return lcmm(values);
}

console.log(solvePart1())
console.log(solvePart2())
