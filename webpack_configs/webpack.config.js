import commonCopy from "./common_import.js";
import { webpackDev } from "devdeps";

const devConfig = () =>  {
    const cfg = webpackDev(commonCopy);
    const headers = {
        "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
    }
    console.log(cfg.devServer);
    cfg.devServer.headers = headers;
    return cfg;
}

export default devConfig;
