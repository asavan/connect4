import {assert} from "netutils";

let myWorker = null;
let promiseHolder = null;
try {
    myWorker = new Worker(new URL("./worker.js", import.meta.url), {
        type: "module",
    });
    const handleWorkerMessage = function (e) {
        const res = e.data.result;
        assert(promiseHolder != null, "No holder");
        promiseHolder.resolve(res);
    };

    myWorker.addEventListener("message", handleWorkerMessage, false);

} catch (e) {
    console.error(e);
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
