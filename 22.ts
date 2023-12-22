const text = await Deno.readTextFile('input.txt')

const bricks = text
    .split('\n')
    .map(brick => brick
        .split('~')
        .map(coord => coord.split(',').map(n => parseInt(n))))
    .toSorted((a, b) => a[0][2] - b[0][2])

const intersects = (a, b) => {
    const [[x1, y1, _z1], [x2, y2, _z2]] = a;
    const [[xx1, yy1, _zz1], [xx2, yy2, _zz2]] = b;
    return Math.max(x1, xx1) <= Math.min(x2, xx2) && (Math.max(y1, yy1) <= Math.min(y2, yy2));
}

const settleBricks = () => {
    bricks.forEach((brick, i) => {
        const z1 = brick[0][2];
        let whereCanFall = 1;
        for(let j = 0; j < i; j++) {
            const z2 = bricks[j][1][2];
            if(intersects(bricks[i], bricks[j])) {
                whereCanFall = Math.max(whereCanFall, z2 + 1)
            }
        }
        const diff = z1 - whereCanFall;
        bricks[i][0][2] -= diff;
        bricks[i][1][2] -= diff;
    })
}

const isSupporting = new Map<number, number[]>();
const isSupportedBy = new Map<number, number[]>();
const setMaps = () => {
    bricks.sort((a, b) => a[0][2] - b[0][2])
    bricks.forEach((brick, i) => {
        bricks.slice(i + 1).forEach((newBrick, j) => {
            if(intersects(brick, newBrick) && brick[1][2] + 1 === newBrick[0][2]) {
                const tmpI = i + 1 + j;
                if(!isSupporting.has(i)) isSupporting.set(i, []);
                isSupporting.set(i, [...isSupporting.get(i)!, tmpI]);

                if(!isSupportedBy.has(tmpI)) isSupportedBy.set(tmpI, []);
                isSupportedBy.set(tmpI, [...isSupportedBy.get(tmpI)!, i]);
            }
        })
        if(!isSupporting.has(i)) isSupporting.set(i, []);
        if(!isSupportedBy.has(i)) isSupportedBy.set(i, []);
    })
}

const solvePart1 = () => {
    settleBricks();
    setMaps();
    let result = 0;
    isSupporting.forEach((supporting) => {
        if(supporting.every(s => isSupportedBy.get(s)!.length > 1)) {
            result++;
        }
    })
    return result;
}

const solvePart2 = () => {
    let result = 0;
    bricks.forEach((_, i) => {
        const queue = isSupporting.get(i)!.filter(n => isSupportedBy.get(n)!.length === 1)
        let visited = new Set(queue);
        visited.add(i);

        while(queue.length > 0) {
            const cur = queue.shift()!;
            const supporters = isSupporting.get(cur)!.filter(n => !visited.has(n))
            supporters.forEach(sup => {
                if(isSupportedBy.get(sup)!.every(s => visited.has(s))) {
                    queue.push(sup);
                    visited.add(sup);
                }
            })
        }

        result += visited.size - 1;
    })
    return result;
}

const part1 = solvePart1();
const part2 = solvePart2();

console.log(part1)
console.log(part2)
