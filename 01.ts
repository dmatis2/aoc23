const text = await Deno.readTextFile('input.txt')

const solvePart1 = (line: string) => {
    const vv = line.replace(/\D/g, '');
    return parseInt(vv[0] + vv[vv.length - 1])
}

const part1 = text.split('\n').reduce((acc, v) => acc + solvePart1(v), 0)

const part2 = text.split('\n').reduce((acc, v) => {
    let vv = '';
    for(let i = 0; i < v.length; i++) {
        let skip = false;
        let toAdd = v[i];
        ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'].forEach((str, idx) => {
            if(skip) return;
            if(v.substring(i).startsWith(str)) {
                toAdd = '' + (idx + 1)
                i += str.length - 2
                skip = true
            }
        })
        vv += toAdd
    }
    return acc + solvePart1(vv)
}, 0)

console.log(part1)
console.log(part2)
