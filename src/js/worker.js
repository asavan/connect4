/*
emcc -s EXPORT_ES6=1 -s ENVIRONMENT="web"
-s EXPORTED_FUNCTIONS="['_init','_getBestMove','_playMove','_resetBoard','_getBoardState','_isGameOver']"
-s EXPORTED_RUNTIME_METHODS="['cwrap']"
-o connect4_solver.js connect4_solver.cpp
*/

import createModule from "./lib/ai_generated/connect4_solver.js";

const module = await createModule();
const exports = module;
exports._init();
exports._resetBoard();


self.addEventListener("message", (e) => {
    const data = e.data.input;
    const label = e.data.label;
    console.log("Worker data", data);
    const aiPlayer = 2 - data.index;
    exports._playMove(data.y, data.index - 1);
    console.time("best");
    const nextMove = exports._getBestMove(aiPlayer);
    exports._playMove(nextMove, aiPlayer);
    console.log("NextMove", nextMove);
    console.timeEnd("best");
    postMessage({result: nextMove, label: label});
}, false);
