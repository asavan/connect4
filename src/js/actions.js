"use strict";

function init(game) {
    return {
        "move": (data) => game.externalMove(data)
    };
}

export default init;
