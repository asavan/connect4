import {EMPTY_CELL, FIRST_PLAYER, GAME_DRAW, SECOND_PLAYER} from "./rules.js";


function drawIter(iter, logger, document, field) {
    field.replaceChildren();
    for (const item of iter) {
        logger.log(item);
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (item === SECOND_PLAYER) {
            cell.classList.add("second");
        }
        if (item === FIRST_PLAYER) {
            cell.classList.add("first");
        }
        if (item === EMPTY_CELL) {
            cell.classList.add("empty");
        }
        cell.classList.add("cell");
        field.append(cell);
    }
}

export function getClickIndex(e, count, width) {
    console.log(e.offsetX, count, width);
    return Math.floor((e.offsetX + 1) * count / width);
}

function setupOverlay(document, onClose) {
    const overlay = document.querySelector(".overlay");
    const close = document.querySelector(".close");
    close.addEventListener("click", (e) => {
        e.preventDefault();
        overlay.classList.remove("show");
        if (onClose) {
            onClose();
        }
    }, false);
    return overlay;
}

function onGameEndDraw(res, overlay) {
    const message = "Win";
    const h2 = overlay.querySelector("h2");
    h2.textContent = message;
    const content = overlay.querySelector(".content");
    content.textContent = "hooya";
    overlay.classList.add("show");
}

export function draw(window, document, settings, engine, logger) {
    let curIndex = FIRST_PLAYER;
    document.documentElement.style.setProperty("--field-width", engine.width());
    document.documentElement.style.setProperty("--field-height", engine.height());
    const field = document.querySelector(".field");
    field.classList.remove("disabled");
    const overlay = setupOverlay(document);
    const wF = field.offsetWidth;
    field.addEventListener("click", (e) => {
        const ind = getClickIndex(e, engine.width(), wF);
        logger.log("index", ind);
        const res = engine.move(ind, curIndex);
        if (res > 0) {
            const iter = engine.iterateHorizontal();
            drawIter(iter, logger, document, field);
            curIndex = 3 - curIndex;
            if (res === FIRST_PLAYER || res === GAME_DRAW || res === SECOND_PLAYER) {
                field.classList.add("disabled");
                onGameEndDraw(res, overlay);
            }
        }
    });
    logger.log(field);
    const iter = engine.iterateHorizontal();
    drawIter(iter, logger, document, field);
}
