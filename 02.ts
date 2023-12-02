const text = await Deno.readTextFile('input.txt')

const COLORS = ['red', 'green', 'blue'];
const BAG = [12, 13, 14];

const parsedInput = text
    .split('\n')
    .map(game => {
        const { id, cubes } = game.match(/Game (?<id>\d+): (?<cubes>.*)/)!.groups!;
        const counts = cubes
            .split('; ')
            .map(set => {
                return set
                    .split(', ')
                    .reduce((acc, v) => {
                        const [num, color] = v.split(' ');
                        acc[COLORS.indexOf(color)] = parseInt(num);
                        return acc;
                    }, [0, 0, 0])
            })
        return {
            id: parseInt(id),
            counts,
            max: counts.reduce((acc, v) => acc.map((n, i) => Math.max(n, v[i])), [0, 0, 0])
        }
    })

const solvePart1 = (input) => {
    return input.reduce((acc, game) => {
        const isPossible = game.max.every((v, i) => v <= BAG[i]);
        return isPossible ? acc + game.id : acc;
    }, 0);
}

const solvePart2 = (input) => {
    return input.reduce((acc, game) => {
        return acc + game.max.reduce((acc, v) => acc * v, 1);
    }, 0);
}

console.log(solvePart1(parsedInput));
console.log(solvePart2(parsedInput));