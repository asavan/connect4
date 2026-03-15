"use strict";

function init(game) {
    return {
        "player": (data) => game.testSecret(data),
        "sendSecret": (data) => game.tellSecret(data),
        "sendAnswer": (data) => game.takeResp(data)
    };
}

export default init;
