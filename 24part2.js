import { init } from "z3-solver";
const { Context } = await init();
const { Solver, Int } = new Context('main');

const xr = Int.const('xr')
const yr = Int.const('yr')
const zr = Int.const('zr')
const dyr = Int.const('dyr')
const dxr = Int.const('dxr')
const dzr = Int.const('dzr')

const arr = [
    [
        [ 364193859817003, 337161998875178, 148850519939119 ],
        [ 85, 85, 473 ]
    ],
    [
        [ 222402516161891, 289638719990878, 261939904566871 ],
        [ 123, -40, 25 ]
    ],
    [
        [ 219626703416113, 76777384100180, 165418060594769 ],
        [ 115, 317, 193 ]
    ]
]

const solver = new Solver();

for(let i = 0; i < arr.length; i++) {
    solver.add(xr.sub(Int.val(arr[i][0][0])).mul(Int.val(arr[i][1][1]).sub(dyr)).eq(yr.sub(Int.val(arr[i][0][1])).mul(Int.val(arr[i][1][0]).sub(dxr))))
    solver.add(yr.sub(Int.val(arr[i][0][1])).mul(Int.val(arr[i][1][2]).sub(dzr)).eq(zr.sub(Int.val(arr[i][0][2])).mul(Int.val(arr[i][1][1]).sub(dyr))))
}

if(await solver.check() === 'sat') {
    const model = solver.model();
    let result = 0n;
    result += model.eval(xr).value()
    result += model.eval(yr).value()
    result += model.eval(zr).value()
    console.log(result);
}
