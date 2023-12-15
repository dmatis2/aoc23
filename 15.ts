const text = await Deno.readTextFile('input.txt')

const getValue = (str: string) => {
    return str.split('').reduce((acc, v) => ((acc + v.charCodeAt(0)) * 17 % 256), 0)
}

const getBoxNumber = (str: string) => {
    return getValue(str.split(/(=|-)/)[0])
}


const boxes = new Map()
text
    .split(',')
    .forEach(str => {
        const box = getBoxNumber(str);
        if(str.includes('-')) {
            const [label, op] = str.split(/(=|-)/)
            const oldBoxValue = boxes.get(box);
            if(!oldBoxValue) {
                return;
            }
            boxes.set(box, oldBoxValue.filter(x => x[0] !== label))
        }
        if(str.includes('=')) {
            const [label, num] = str.split('=');
            const oldBoxValue = boxes.get(box);
            if(!oldBoxValue) {
                boxes.set(box, [[label, parseInt(num)]])
                return;
            }
            if(oldBoxValue.some(b => b[0] === label)) {
                boxes.set(box, oldBoxValue.map(b => b[0] === label ? [label, parseInt(num)] : b))
                return;
            }
            boxes.set(box, [...oldBoxValue, [label, parseInt(num)]])
        }
    });

const part1 = text.split(',').reduce((acc, str) => acc + getValue(str), 0)

const part2 = [...boxes.keys()]
    .reduce((acc, i) => {
        const b = boxes.get(i);
        const tmp = b.reduce((acc2, v, si) => acc2 + (i + 1) * (si + 1) * v[1], 0)
        return acc + tmp;
    }, 0);


console.log(part1)
console.log(part2)
