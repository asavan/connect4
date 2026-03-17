import {
    loggerFunc,
    netObj
} from "netutils";
import {draw} from "../layout.js";
import {presenter} from "../presenter.js";

export default function hotseatMode(window, document, settings, trans) {
    const logger = loggerFunc(document, settings, 3);
    const myId = netObj.getMyId(window, settings, Math.random);
    logger.log("id", myId);

    const p = presenter(settings, logger, trans);
    draw(window, document, settings, p, logger);
    return p;
}
