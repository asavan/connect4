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

export function draw(window, document, settings, engine, logger) {
    let curIndex = FIRST_PLAYER;
    // document.documentElement.style.setProperty("--field-size", engine.);
    const field = document.querySelector(".field");
    const wF = field.offsetWidth;
    field.addEventListener("click", (e) => {
        const ind = getClickIndex(e, engine.width(), wF);
        logger.log("index", ind);
        const res = engine.move(ind, curIndex);
        if (res > 0 && res !== GAME_DRAW) {
            const iter = engine.iterateHorizontal();
            drawIter(iter, logger, document, field);
            curIndex = 3 - curIndex;
        }
    });
    logger.log(field);
    const iter = engine.iterateHorizontal();
    drawIter(iter, logger, document, field);
}
