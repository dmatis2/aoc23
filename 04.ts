const text = await Deno.readTextFile('input.txt');

const parsed = text
    .split('\n')
    .map(line => line.split(':')[1].trim())
    .map(line => line.split(' | '))
    .map(line => line.map(item => item.split(/ +/).filter(n => n.length > 0).map(n => parseInt(n.trim()))))
    
const part1 = parsed.reduce((acc, v) => {
    const winningCards = v[0].filter(w => v[1].includes(w))
    const winning = winningCards.length
    if(winning <= 0) return acc;
    return acc + 2 ** (winning - 1);
}, 0)
console.log(part1);

const cardsMap = new Map();
for(let i = 0; i < parsed.length; i++) {
    if(!cardsMap.has(i)) cardsMap.set(i, 0);
    cardsMap.set(i, cardsMap.get(i) + 1);
    const winningCards = parsed[i][0].filter(w => parsed[i][1].includes(w))
    const copies = cardsMap.get(i);
    for(let j = i + 1; j < i + 1 + winningCards.length; j++) {
        if(!cardsMap.has(j)) cardsMap.set(j, 0);
        cardsMap.set(j, cardsMap.get(j) + copies);
    }
}
const part2 = [...cardsMap.values()].reduce((acc, v) => acc + v, 0);

console.log(part2);