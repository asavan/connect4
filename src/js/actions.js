"use strict";

function init(game) {
    return {
        "move": (data) => game.externalMove(data),
        "reload": (data) => game.onReloadSignal(data)
    };
}

export default init;
