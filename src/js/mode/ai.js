import {presenter} from "../presenter.js";
import {draw} from "../layout.js";
import {loggerFunc} from "netutils";
import {getBestMoveByPlayer, resetBoard} from "../worker_wrapper.js";

export default function ai(window, document, settings, gameFunction, trans) {
    const logger = loggerFunc(document, settings, 3);
    const p = presenter(settings, logger, trans);
    const dd = draw(window, document, settings, p, logger);
    p.setDrawer(dd);

    p.on("move", async (data) => {
        const nextMove = await getBestMoveByPlayer(data);
        const res = await p.tryMove(nextMove, p.nextIndex(p.getMyIndex()), dd);
        console.log("After bot moved", res);
    });
    p.on("reload", () => {
        resetBoard();
    });
    return p;
}
