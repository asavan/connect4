import init, { Solver, Position } from "connect-four-ai-wasm";
import {random} from "netutils";

async function createAndInit() {
    const exports = await init();

    const solver = new Solver();
    console.log("Afret init", exports, solver, Position);
    return {exports, solver};
}

const moduleHolder = createAndInit();

self.addEventListener("message", async (e) => {
    console.log("inside worker", e.data);
    if (e.data.type === "reset") {
        return;
    }
    const {solver} = await moduleHolder;
    const data = e.data.input;
    // let position = Position.fromMoves(data.moves);
    const position = Position.fromMoves(data);
    console.time("best");
    const moves = solver.getAllMoveScores(position);
    const maxValue = Math.max(...moves); // Find the maximum value
    const results = [];
    let i = 0;
    for (const el of moves) {
        if (el === maxValue) {
            results.push(i);
        }
        ++i;
    }
    const maxIndex = random.randomEl(results, Math.random);
    // const maxIndex = moves.indexOf(maxValue); // Find the index of that value
    console.timeEnd("best");
    console.log("NextMove", moves, data);
    postMessage({result: maxIndex});
}, false);
