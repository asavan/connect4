import {engine, FIRST_PLAYER, GAME_DRAW, SECOND_PLAYER} from "./rules.js";
import {handlersFunc, assert} from "netutils";

export function presenter(settings, logger, trans) {
    let myIndex = settings.myIndex;
    const initArr = Array(settings.width).fill(1);

    let externalDrawer = null;
    let gameStarted = false;

    const isStarted = () => gameStarted;
    const start = () => {
        gameStarted = true;
    };

    const setDrawer = (d) => {
        externalDrawer = d;
    };

    let eng = engine(initArr, settings.height, settings.maxLen, logger, assert);

    const initGame = (data) => {
        eng = engine(data.field, data.height, data.maxLen, logger, assert);
        myIndex = data.index;
        gameStarted = true;
    };

    const handlers = handlersFunc(["move", "reload"]);
    const {on, actionKeys, getAction} = handlers;

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

    const tryDraw = (drawer) => {
        drawer = drawer || externalDrawer;
        if (drawer) {
            const iter = eng.iterateHorizontal();
            drawer.drawField(iter);
        } else {
            logger.log("No drawer");
        }
    };

    const tryRestartView = (drawer) => {
        drawer = drawer || externalDrawer;
        if (drawer) {
            drawer.onRoundStart();
        } else {
            logger.log("No drawer2");
        }
    };


    const tryMove = async (y, playerIndex, drawer) => {
        const res = eng.move(y, playerIndex);
        if (res > 0) {
            const iter = eng.iterateHorizontal();
            if (playerIndex === myIndex) {
                handlers.call("move", {y, index: myIndex});
            }
            if (drawer) {
                drawer.drawField(iter);
            }
            if (res === FIRST_PLAYER || res === GAME_DRAW || res === SECOND_PLAYER) {
                const firstMessage = await getFirstMessage(res);
                const secondMessage = await getSecondMessage(res);
                if (drawer) {
                    drawer.onGameEndDraw(res, firstMessage, secondMessage);
                }
            }
            if (settings.mode === "hotseat") {
                myIndex = nextIndex(myIndex);
            }
        }
    };

    const externalMove = (data) => tryMove(data.y, data.index, externalDrawer);

    const myMove = (y) => tryMove(y, getMyIndex(), externalDrawer);

    const {width, height, iterateHorizontal} = eng;

    const initInfo = () => ({
        field: eng.compressedField(),
        height: eng.height(),
        maxLen: eng.getMaxLen(),
        index: nextIndex(getMyIndex())
    });

    const reloadClient = (drawer) => {
        myIndex = nextIndex(myIndex);
        eng = engine(initArr, settings.height, settings.maxLen, logger, assert);
        const info = initInfo();
        handlers.call("reload", info);
        tryRestartView(drawer);
        tryDraw(drawer);
    };

    const onReloadSignal = (data) => {
        initGame(data);
        tryRestartView();
        tryDraw();
    };

    return {
        on, actionKeys, getAction,
        initGame,
        tryDraw,
        nextIndex,
        getMyIndex,
        tryMove,
        initInfo,
        isStarted,
        start,
        setDrawer,
        externalMove,
        myMove,
        reloadClient,
        onReloadSignal,
        iterateHorizontal,
        width,
        height
    };
}
