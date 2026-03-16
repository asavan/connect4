"use strict";

import actionsFunc from "../actions.js";
import {
    actionToHandler,
    broadcastConnectionFunc,
    createSignalingChannel,
    loggerFunc,
    makeQrStr,
    removeElem,
    netObj
} from "netutils";
import {DEFAULT_ROWS, DEFAULT_FIELD, engine} from "../rules.js";
import {draw} from "../layout.js";


function makeQr(window, document, settings, serverId) {
    const staticHost = netObj.getHostUrl(settings, window.location);
    const url = new URL(staticHost);
    if (serverId) {
        url.searchParams.set("serverId", serverId);
    }
    url.searchParams.set("mode", "net");
    console.log("enemy url", url.toString());
    const image = {
        source: "./images/connect4.svg",
        width: "15%",
        height: "15%",
        x: "center",
        y: "center",
    };
    return makeQrStr(url.toString(), window, document, settings, image);
}

function setupGameToConnectionSend(game, con, logger, actionKeys) {
    for (const handlerName of actionKeys) {
        logger.log("register " + handlerName);
        game.on(handlerName, (n) => {
            logger.log("send " + handlerName);
            try {
                con.sendRawAll(handlerName, n);
            } catch (e) {
                logger.error(e);
            }
            logger.log("after call " + handlerName);
        });
    }
}

export default async function netMode(window, document, settings, gameFunction) {
    const logger = loggerFunc(document, settings, 3);
    const myId = netObj.getMyId(window, settings, Math.random);
    logger.log("id", myId);
    const networkLogger = loggerFunc(document, settings, 2);
    const gameChannel = await createSignalingChannel(myId, settings.serverId, window.location, settings, networkLogger);
    const serverId = settings.serverId || myId;
    const code = makeQr(window, document, settings, serverId);
    gameChannel.on("close", () => {
        removeElem(code);
    });

    const connection = broadcastConnectionFunc(myId, networkLogger, gameChannel);
    const gameInitPromise = Promise.withResolvers();
    connection.on("gameinit", (data) => {
        logger.log("gameinit1");
        gameInitPromise.resolve(data);
    });

    connection.on("join", (data) => {
        logger.log("join2");
        openCon.sendRawAll("gameinit", {});
        gameInitPromise.resolve(data);
    });

    const openCon = await connection.connect();
    logger.log("connected");
    openCon.sendRawAll("join", {});

    const eng = engine(DEFAULT_FIELD, DEFAULT_ROWS, 4, logger, (cond) => {
        if (!cond) {
            throw Error("Bad happen");
        }
    });
    draw(window, document, settings, eng, logger);

    const game = gameFunction(window, document, settings);
    const actions = actionsFunc(game);
    const gameHandler = actionToHandler(actions);
    openCon.registerHandler(gameHandler);
    setupGameToConnectionSend(game, openCon, networkLogger, Object.keys(actions));

    await gameInitPromise.promise;
    removeElem(code);
    return game;
}
