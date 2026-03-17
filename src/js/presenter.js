import {engine, FIRST_PLAYER, GAME_DRAW, SECOND_PLAYER} from "./rules.js";

export function presenter(settings, logger, trans) {
    let myIndex = settings.myIndex;
    const initArr = Array(settings.width).fill(1);

    const eng = engine(initArr, settings.height, settings.maxLen, logger, (cond) => {
        if (!cond) {
            throw Error("Bad happen");
        }
    });

    const nextIndex = (ind) => FIRST_PLAYER + SECOND_PLAYER - ind;

    const getMyIndex = () => myIndex;

    const getFirstMessage = async (res) => {
        if (res === GAME_DRAW) {
            return await trans.t("draw");
        }
        if (res === myIndex) {
            return await trans.t("win");
        }
        return await trans.t("loose");
    };

    const getSecondMessage = async (res) => {
        if (res === GAME_DRAW) {
            return await trans.t("next");
        }
        if (res === myIndex) {
            return await trans.t("good");
        }
        return await trans.t("lost");
    };


    const tryMove = async (y, playerIndex, drawer) => {
        const res = eng.move(y, playerIndex);
        if (res > 0) {
            const iter = eng.iterateHorizontal();
            drawer.drawField(iter);
            if (res === FIRST_PLAYER || res === GAME_DRAW || res === SECOND_PLAYER) {
                const firstMessage = await getFirstMessage(res);
                const secondMessage = await getSecondMessage(res);
                drawer.onGameEndDraw(res, firstMessage, secondMessage);
            }
            if (settings.mode === "hotseat") {
                myIndex = nextIndex(myIndex);
            }
        }
    };

    const {width, height, iterateHorizontal} = eng;

    return {
        getMyIndex,
        tryMove,
        iterateHorizontal,
        width,
        height
    };
}
