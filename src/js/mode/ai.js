"use strict";

import {delay, random} from "netutils";

function simpleBot(settings, game) {

    // const myIndex = game.nextIndex(game.getMyIndex());
    // const data = game.initInfo();

    const result = [];
    for (let i = 0; i < settings.size; i++) {
        let cand = random.randomInteger(settings.min, settings.max + 1, Math.random);
        while (!settings.repeat && result.includes(cand)) {
            cand = random.randomInteger(settings.min, settings.max + 1, Math.random);
        }
        result.push(cand);
    }

    game.tellSecret(result.join(""));
    game.setMyNumber(result.join(""));

    const makeMove = async function (num) {
        const res = await game.testSecret(num);
        await delay(200);
        await game.takeResp(res);
        return res;
    };

    return {makeMove};
}

export default function ai(window, document, settings, gameFunction) {
    const game = gameFunction(window, document, settings);
    const bot = simpleBot(settings, game);
    game.on("player", (move) => bot.makeMove(move));
    return game;
}
