const text = await Deno.readTextFile('input.txt')

const input = text.split('\n')
const maxRow = input.length;
const maxCol = input[0].length;

const isOutOfBounds = (row: number, col: number) => {
    return row < 0 || row >= maxRow || col < 0 || col >= maxCol;
}

const isNumber = (row: number, col: number) => {
    if(isOutOfBounds(row, col)) return false;
    return input[row][col].match(/\d/);
}

const isSymbol = (row: number, col: number) => {
    if(isOutOfBounds(row, col)) return false;
    return !input[row][col].match(/(\.|\d)/);
}

const isGear = (row: number, col: number) => {
    if(isOutOfBounds(row, col)) return false;
    return input[row][col] === '*';
}

let part1 = 0;
const gearMap = new Map();

for(let row = 0; row < maxRow; row++) {
    let currentNum = '';
    let startIndex = -1;
    let endIndex = -1;

    for(let col = 0; col < maxCol; col++) {
        if(isNumber(row, col)) {
            startIndex = col;
            while(isNumber(row, col)) {
                currentNum += input[row][col];
                col++;
            }
            
            endIndex = col;
            let foundSymbol = false;

            if(isSymbol(row, startIndex - 1) || isSymbol(row, endIndex)) {
                const num = parseInt(currentNum);
                if(isGear(row, startIndex - 1)) gearMap.set(JSON.stringify([row, startIndex - 1]), gearMap.get(JSON.stringify([row, startIndex - 1])) ? [...gearMap.get(JSON.stringify([row, startIndex - 1])), num] : [num]);
                if(isGear(row, endIndex)) gearMap.set(JSON.stringify([row, endIndex]), gearMap.get(JSON.stringify([row, endIndex])) ? [...gearMap.get(JSON.stringify([row, endIndex])), num] : [num]);
                part1 += num;
                foundSymbol = true;
            }

            for(let i = startIndex - 1; i <= endIndex; i++) {
                if(foundSymbol) continue;
                if(isSymbol(row - 1, i) || isSymbol(row + 1, i)) {
                    const num = parseInt(currentNum);
                    if(isGear(row - 1, i)) gearMap.set(JSON.stringify([row - 1, i]), gearMap.get(JSON.stringify([row - 1, i])) ? [...gearMap.get(JSON.stringify([row - 1, i])), num] : [num]);
                    if(isGear(row + 1, i)) gearMap.set(JSON.stringify([row + 1, i]), gearMap.get(JSON.stringify([row + 1, i])) ? [...gearMap.get(JSON.stringify([row + 1, i])), num] : [num]);
                    part1 += num;
                    
                    foundSymbol = true;
                    break;
                }
            }

            currentNum = '';
            startIndex = -1;
            endIndex = -1;
            col--;
        }
    }
}

console.log(part1);
const part2 = [...gearMap.values()].filter(v => v.length === 2).reduce((acc, v) => acc + v[0] * v[1], 0);
console.log(part2);