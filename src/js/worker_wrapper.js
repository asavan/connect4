import {assert} from "netutils";

let myWorker = null;
let promiseHolder = null;

export function initWorker(logger) {
    const handleWorkerMessage = function (e) {
        const res = e.data.result;
        if (promiseHolder != null) {
            promiseHolder.resolve(res);
        } else {
            logger.log("No promiseHolder");
            logger.log(e.data);
        }
    };
    try {
        myWorker = new Worker(new URL("./worker.js", import.meta.url), {
            type: "module",
        });
        myWorker.onerror = (error) => {
            logger.log(`Worker error: ${error.message}`);
            // throw error;
        };
        myWorker.addEventListener("message", handleWorkerMessage, false);

    } catch (e) {
        logger.error(e);
    }
}

export async function getBestMoveByPlayer(data) {
    if (!myWorker) {
        console.log("No Worker");
        return -2;
    }
    assert(promiseHolder == null, "concurrent call");
    promiseHolder = Promise.withResolvers();
    myWorker.postMessage({input: data});
    const result = await promiseHolder.promise;
    promiseHolder = null;
    return result;
}

export function resetBoard() {
    myWorker.postMessage({type: "reset"});
}
