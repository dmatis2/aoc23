const text = await Deno.readTextFile('input.txt')

const parsed = text
    .split('\n\n')
    .map(pattern => pattern.split('\n').map(row => row.split('')))

const isMirroring = (pattern, horizontalMirror) => {
    let [up, down] = [horizontalMirror - 2, horizontalMirror + 1]
    while(up >= 0 && down < pattern.length) {
        if(pattern[up].join('') !== pattern[down].join('')) {
            return false;
        }
        up--;
        down++;
    }
    return true;
}

const getTransposed = (pattern) => {
    return pattern[0].map((_, colIndex) => pattern.map(row => row[colIndex]));
}

const getPossibleVertices = (pattern) => {
    let possibleMirror = []
    for(let row = 1; row < pattern.length; row++) {
        if(pattern[row - 1].join('') === pattern[row].join('')) {
            possibleMirror.push(row);
        }
    }
    return possibleMirror;
}

let part2 = 0;
const part1 = parsed
    .map(pattern => {
        let possibleHorizontalMirror = getPossibleVertices(pattern)
        const transpose = getTransposed(pattern)
        let possibleVerticalMirror = getPossibleVertices(transpose);
        let vertical = -1;
        let horizontal = -1;

        const pV = possibleVerticalMirror.filter(c => isMirroring(transpose, c)).reduce((acc, v) => {
            vertical = v;
            return acc + v
        }, 0)
        const hV = possibleHorizontalMirror.filter(c => isMirroring(pattern, c)).reduce((acc, v) => {
            horizontal = v;
            return acc + 100 * v
        }, 0);

        let part2SolutionFound = false;
        for(let r = 0; r < pattern.length; r++) {
            if(part2SolutionFound) break;
            for(let c = 0; c < pattern[0].length; c++) {
                let newPattern = structuredClone(pattern);
                newPattern[r][c] = pattern[r][c] === '.' ? '#' : '.';
                const t = getTransposed(newPattern);
                const pHM = getPossibleVertices(newPattern).filter(h => horizontal !== h && isMirroring(newPattern, h))
                const pVM = getPossibleVertices(t).filter(v => vertical !== v && isMirroring(t, v))
                if(pHM.length > 0 || pVM.length > 0) {
                    part2 += pHM.length > 0 ? pHM[0] * 100 : 0
                    part2 += pVM.length > 0 ? pVM[0] : 0
                    part2SolutionFound = true;
                    break;
                }
            }
        }
        return pV + hV;
    })
    .reduce((acc, v) => acc + v, 0)

console.log(part1)
console.log(part2)