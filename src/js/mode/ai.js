import {presenter} from "../presenter.js";
import {draw} from "../layout.js";
import {delay, loggerFunc} from "netutils";
import {getBestMoveByPlayer, resetBoard} from "../worker_wrapper.js";

export default function ai(window, document, settings, gameFunction, trans) {
    const logger = loggerFunc(document, settings, 3);
    const p = presenter(settings, logger, trans);
    const dd = draw(window, document, settings, p, logger);
    p.setDrawer(dd);

    p.on("move", async (data) => {
        const timer = delay(1200);
        const nextMove = await getBestMoveByPlayer(p.historyAsString());
        await timer;
        const res = await p.tryMove(nextMove, p.nextIndex(p.getMyIndex()), dd);
        console.log("After bot moved", res, data);
    });
    p.on("reload", async () => {
        resetBoard();
        if (!p.isMyTurn()) {
            const nextMove = await getBestMoveByPlayer("");
            const res = await p.tryMove(nextMove, p.nextIndex(p.getMyIndex()), dd);
            console.log("reload1", res);
        }
    });
    return p;
}
