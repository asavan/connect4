"use strict";

import settings from "./settings.js";
import gameFunction from "./game.js";
import {parseSettings, assert} from "netutils";

export default async function starter(window, document) {
    parseSettings(window.location.search, settings);

    if (settings.mode === "net") {
        const netMode = await import("./mode/net_mode.js");
        netMode.default(window, document, settings, gameFunction);
    } else if (settings.mode === "ai") {
        const ai = await import("./mode/ai.js");
        const g = await ai.default(window, document, settings, gameFunction);
        g.on("gameover", (score) => {
            console.log("Score", score);
            const btnAdd = document.querySelector(".butInstall");
            btnAdd.classList.remove("hidden2");
        });
    } else {
        assert(false, "Unsupported mode");
    }
}
