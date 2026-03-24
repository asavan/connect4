
import {presenter} from "../presenter.js";
import {draw} from "../layout.js";
import {loggerFunc} from "netutils";

let myWorker = null;
try {
    myWorker = new Worker(new URL("../worker.js", import.meta.url), {
        type: "module",
    });
} catch (e) {
    console.log(e);
}

export default function ai(window, document, settings, gameFunction, trans) {
    const logger = loggerFunc(document, settings, 3);
    const handlers = new Map();
    const p = presenter(settings, logger, trans);
    const dd = draw(window, document, settings, p, logger);
    p.setDrawer(dd);

    p.on("move", (data) => {
        const label = new Date().toISOString();
        const callback = (nextMove) => {
            p.tryMove(nextMove, p.nextIndex(p.getMyIndex()), dd);
        };
        handlers.set(label, callback);
        if (myWorker) {
            myWorker.postMessage({input: data, label: label});
        }
    });

    if (myWorker) {
        const handleWorkerMessage = function (e) {
            console.log(e.data.label);
            const res = e.data.result;
            const callback = handlers.get(e.data.label);
            handlers.delete(e.data.label);
            callback(res);
        };

        myWorker.addEventListener("message", handleWorkerMessage, false);
    }

    return p;
}
