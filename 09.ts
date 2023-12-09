const text = await Deno.readTextFile('input.txt')

const parsed = text
    .split('\n')
    .map(line => line.split(' ').map(n => parseInt(n)))

const isAllZero = (inputRow: number[]) => {
    return inputRow.every(n => n === 0);
}
const getNextRow = (inputRow: number[]) => {
    const newRow = [];
    for(let col = 0; col < inputRow.length - 1; col++) {
        newRow.push(inputRow[col + 1] - inputRow[col])
    }
    return newRow
}

const getHistory = (inputRow: number[]) => {
    let rows = [inputRow]
    let newRow = inputRow;
    while(!isAllZero(newRow)) {
        newRow = getNextRow(newRow)
        rows.push(newRow)
    }
    return rows;
}

const fillPlacements = (history: number[], addAtEnd = true) => {
    for(let r = history.length - 2; r >= 0; r--) {
        if(addAtEnd) {
            history[r].push(history[r].at(-1) + history[r+1].at(-1))
            continue;
        }
        history[r].unshift(history[r].at(0) - history[r+1].at(0))

    }
    return history;
}

const solvePart1 = () => {
    let result = 0;
    for(let i = 0; i < parsed.length; i++) {
        const history = getHistory(parsed[i])
        history.at(-1).push(0)
        const newHistory = fillPlacements(history);
        result += newHistory.at(0).at(-1)
    }
    return result;
}

const solvePart2 = () => {
    let result = 0;
    for(let i = 0; i < parsed.length; i++) {
        const history = getHistory(parsed[i])
        history[history.length - 1].unshift(0)
        const newHistory = fillPlacements(history, false);
        result += newHistory.at(0).at(0)
    }
    return result;
}

console.log(solvePart1());
console.log(solvePart2());