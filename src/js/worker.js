/*
emcc -s EXPORT_ES6=1 -s ENVIRONMENT="web"
-s EXPORTED_FUNCTIONS="['_init','_getBestMove','_playMove','_resetBoard','_getBoardState','_isGameOver']"
-s EXPORTED_RUNTIME_METHODS="['cwrap']"
-o connect4_solver.js connect4_solver.cpp
*/

// import createModule from "./lib/ai_generated/connect4_solver.js";
import createModule from "./lib/christophe_steininger_c4/solver.js";

async function createAndInit() {
    const module = await createModule();
    console.log("loaded", module);
    const exports = module;
    exports._init();
    exports._resetBoard();
    const solver = new module.Solver();
    return {exports, solver};
}

async function resetBoard() {
    const {exports} = await moduleHolder;
    exports._resetBoard();
    console.log("reseted");
}

const moduleHolder = createAndInit();

self.addEventListener("message", async (e) => {
    console.log("inside worker", e.data);
    if (e.data.type === "reset") {
        await resetBoard();
        return;
    }
    const {exports, solver} = await moduleHolder;
    const data = e.data.input;
    console.log("Worker data", data);
    if (data) {
        exports._playMove(data.y);
    }
    console.time("best");
    const nextMove = exports._getBestMove(solver);
    console.timeEnd("best");
    if (nextMove < 0) {
        // const state = exports._getBoardState();
        console.log("Bad move");
        postMessage({result: nextMove});
        return;
    }
    exports._playMove(nextMove);
    console.log("NextMove", nextMove);
    postMessage({result: nextMove});
}, false);

