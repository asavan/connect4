import {engine, FIRST_PLAYER, GAME_DRAW, SECOND_PLAYER} from "./rules.js";
import {handlersFunc, assert, delay} from "netutils";
import {audioManager} from "./audio.js";

export function presenter(settings, logger, trans) {
    let myIndex = settings.myIndex;
    const initArr = Array(settings.width).fill(1);

    let round = 0;

    let externalDrawer = null;
    let gameStarted = false;

    const audioM = audioManager(settings, logger);
    // await ?
    audioM.loadAll();

    let movesHistory = [];

    const isStarted = () => gameStarted;
    const start = () => {
        gameStarted = true;
    };

    const setDrawer = (d) => {
        externalDrawer = d;
    };

    let eng = engine(initArr, settings.height, settings.maxLen, logger, assert, round);

    const initGame = (data) => {
        eng = engine(data.field, data.height, data.maxLen, logger, assert, round);
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
            // const iter = eng.iterateHorizontal();
            drawer.drawByPresenter();
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
        logger.log("res1", res);
        if (res < 0) {
            console.error("Bad Move");
            return res;
        }
        movesHistory.push(y);
        if (playerIndex === myIndex) {
            handlers.call("move", {y, index: myIndex});
        }
        drawer = drawer || externalDrawer;
        if (drawer) {
            drawer.drawMove(y, audioM);
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
        return res;
    };

    const externalMove = (data) => tryMove(data.y, data.index, externalDrawer);

    const myMove = (y) => tryMove(y, getMyIndex(), externalDrawer);

    // const {width, height, iterateHorizontal, cell, checkCurrIndex, getCurrIndex, emptySizeInCol, getRound} = eng;
    const width = () => eng.width();
    const height = () => eng.height();
    const cell = (x, y) => eng.cell(x, y);
    const iterateHorizontal = eng.iterateHorizontal();
    const checkCurrIndex = (ind) => eng.checkCurrIndex(ind);
    const getCurrIndex = () => eng.getCurrIndex();
    const emptySizeInCol = (ind) => eng.emptySizeInCol(ind);
    const getRound = () => eng.getRound();

    const historyAsString = () => movesHistory.map(i => i + 1).join("");

    const initInfo = () => ({
        field: eng.compressedField(),
        height: eng.height(),
        maxLen: eng.getMaxLen(),
        index: nextIndex(getMyIndex())
    });

    const reloadClient = async (drawer) => {
        if (settings.switchOrder) {
            myIndex = nextIndex(myIndex);
        }
        if (settings.mode === "hotseat") {
            myIndex = FIRST_PLAYER;
        }
        audioM.play("gameover");
        await delay(500);
        ++round;
        eng = engine(initArr, settings.height, settings.maxLen, logger, assert, round);
        movesHistory = [];
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

    const isMyTurn = () => checkCurrIndex(getMyIndex());

    return {
        on, actionKeys, getAction,
        historyAsString,
        initGame,
        tryDraw,
        nextIndex,
        getCurrIndex,
        emptySizeInCol,
        isMyTurn,
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
        height,
        getRound,
        cell
    };
}
