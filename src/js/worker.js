/*
emcc -s EXPORT_ES6=1 -s ENVIRONMENT="web"
-s EXPORTED_FUNCTIONS="['_init','_getBestMove','_playMove','_resetBoard','_getBoardState','_isGameOver']"
-s EXPORTED_RUNTIME_METHODS="['cwrap']"
-o connect4_solver.js connect4_solver.cpp
*/

import createModule from "./lib/ai_generated/connect4_solver.js";

async function createAndInit() {
    const module = await createModule();
    const exports = module;
    exports._init();
    exports._resetBoard();
    return exports;
}

async function resetBoard() {
    const exports = await moduleHolder;
    exports._resetBoard();
}

const moduleHolder = createAndInit();

self.addEventListener("message", async (e) => {
    console.log("Worker data1");
    if (e.data.type === "reset") {
        await resetBoard();
        return;
    }
    const exports = await moduleHolder;
    const data = e.data.input;
    const resolver = e.data.resolver;
    console.log("Worker data", data);
    const aiPlayer = 2 - data.index;
    exports._playMove(data.y, data.index - 1);
    console.time("best");
    const nextMove = exports._getBestMove(aiPlayer);
    console.timeEnd("best");
    if (nextMove < 0) {
        const state = exports._getBoardState();
        postMessage({result: nextMove, resolver, state});
        return;
    }
    exports._playMove(nextMove, aiPlayer);
    console.log("NextMove", nextMove);
    postMessage({result: nextMove, resolver: resolver});
}, false);

