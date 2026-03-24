import settings from "./settings.js";
import {assert} from "netutils";
import {parseZipSettings} from "netutils/src/js/utils/parse-settings.js";
import translator from "./translation.js";

export default async function starter(window, document) {
    await parseZipSettings(window.location.search, settings);

    // TODO
    const gameFunction = () => ({on : () => {}});

    const trans = translator(settings.lang);

    if (settings.mode === "net") {
        const netMode = await import("./mode/net_mode.js");
        netMode.default(window, document, settings, gameFunction, trans);
    } else if (settings.mode === "hotseat") {
        const hotSeatMode = await import("./mode/hotseat.js");
        hotSeatMode.default(window, document, settings, trans);
    } else if (settings.mode === "ai") {
        const ai = await import("./mode/ai.js");
        await ai.default(window, document, settings, gameFunction, trans);
    } else {
        assert(false, "Unsupported mode");
    }
}
