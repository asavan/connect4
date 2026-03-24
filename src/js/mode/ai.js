"use strict";

/*
emcc -s EXPORT_ES6=1 -s ENVIRONMENT="web"
-s EXPORTED_FUNCTIONS="['_init','_getBestMove','_playMove','_resetBoard','_getBoardState','_isGameOver']"
-s EXPORTED_RUNTIME_METHODS="['cwrap']"
-o connect4_solver.js connect4_solver.cpp
*/
import createModule from "../lib/ai_generated/connect4_solver.js";


export default async function ai(window, document, settings, gameFunction) {

    console.log("Start", window, document, settings, gameFunction);
    const module = await createModule();

    // await delay(500);

    const aiPlayer = 0;
    console.log("Start1", module);
    const exports = module;
    if (!exports) {
        console.log("Exit", module);
        return;
    }

    const isOver = exports._isGameOver();

    exports._init();
    exports._resetBoard();

    console.log("Start2", Date.now());
    console.time("begin");
    const move = exports._getBestMove(aiPlayer);
    console.log("Start3", Date.now());

    console.timeEnd("begin");
    console.log("End", move, isOver);
    // return ;
}
