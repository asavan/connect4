"use strict";

/*
emcc -s EXPORT_ES6=1 -s ENVIRONMENT="web"
-s EXPORTED_FUNCTIONS="['_init','_getBestMove','_playMove','_resetBoard','_getBoardState','_isGameOver']"
-s EXPORTED_RUNTIME_METHODS="['cwrap']"
-o connect4_solver.js connect4_solver.cpp
*/
import createModule from "../lib/ai_generated/connect4_solver.js";
import {presenter} from "../presenter.js";
import {draw} from "../layout.js";
import {loggerFunc} from "netutils";


export default async function ai(window, document, settings, gameFunction, trans) {
    const logger = loggerFunc(document, settings, 3);
    const module = await createModule();
    const exports = module;
    if (!exports) {
        logger.log("Exit", module);
        return;
    }
    const p = presenter(settings, logger, trans);
    const aiPlayer = p.nextIndex(p.getMyIndex()) - 1;

    const dd = draw(window, document, settings, p, logger);
    p.setDrawer(dd);

    exports._init();
    exports._resetBoard();

    p.on("move", (data) => {
        console.time("play");
        exports._playMove(data.y, data.index - 1);
        console.timeEnd("play");
        const delayedF = () => {
            console.time("best");
            const nextMove = exports._getBestMove(aiPlayer);
            logger.log("Move", nextMove);
            p.tryMove(nextMove, aiPlayer + 1, dd);
            exports._playMove(nextMove, aiPlayer);
            console.timeEnd("best");
        };
        setTimeout(delayedF, 100);
    });
    return p;
}
