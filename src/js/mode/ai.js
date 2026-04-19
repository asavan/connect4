import {presenter} from "../presenter.js";
import {draw} from "../layout.js";
import {delay, loggerFunc} from "netutils";
import {initWorker, getBestMoveByPlayer, resetBoard} from "../worker_wrapper.js";
import {VALIDATION_ERROR} from "../rules.js";

function aiHelper(presenter, logger) {
    const move = async (pauseMs) => {
        if (presenter.isMyTurn()) {
            logger.log("Not ai move");
            return VALIDATION_ERROR;
        }
        const timer = delay(pauseMs);
        const nextMove = await getBestMoveByPlayer(presenter.historyAsString());
        await timer;
        const res = await presenter.tryMove(nextMove, presenter.nextIndex(presenter.getMyIndex()));
        logger.log("After bot moved", res);
        return res;
    };
    return {
        move
    };
}

export default function ai(window, document, settings, gameFunction, trans) {
    const logger = loggerFunc(document, settings, 4);
    const logicLogger = loggerFunc(document, settings, 3);
    const debugLogger = loggerFunc(document, settings, 1);
    const layoutLogger = loggerFunc(document, settings, 2);
    window.addEventListener("unhandledrejection", (event) => {
        logger.log(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
    });
    const p = presenter(settings, logicLogger, trans);
    draw(window, document, settings, p, layoutLogger);
    initWorker(logger);
    const helper = aiHelper(p, debugLogger);
    p.on("move", async () => {
        await helper.move(1200);
    });
    p.on("reload", async () => {
        resetBoard();
        await helper.move(1000);
    });
    helper.move(1000);
    return p;
}
