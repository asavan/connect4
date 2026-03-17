import {EMPTY_CELL, FIRST_PLAYER, SECOND_PLAYER} from "./rules.js";


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

function getClickIndex(e, count, width) {
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

function onGameEndDraw(res, overlay, field, message, messageSmall) {
    field.classList.add("disabled");
    const h2 = overlay.querySelector("h2");
    h2.textContent = message;
    const content = overlay.querySelector(".content");
    content.textContent = messageSmall;
    overlay.classList.add("show");
}

export function draw(window, document, settings, presenter, logger) {
    document.documentElement.style.setProperty("--field-width", presenter.width());
    document.documentElement.style.setProperty("--field-height", presenter.height());
    const field = document.querySelector(".field");
    field.classList.remove("disabled");
    const overlay = setupOverlay(document);
    const wF = field.offsetWidth;
    const drawer = {
        drawField: (iter) => drawIter(iter, logger, document, field),
        onGameEndDraw: (res, message, messageSmall) => onGameEndDraw(res, overlay, field, message, messageSmall)
    };
    field.addEventListener("click", (e) => {
        const ind = getClickIndex(e, presenter.width(), wF);
        logger.log("index", ind);
        presenter.tryMove(ind, presenter.getMyIndex(), drawer);
    });
    logger.log(field);
    drawer.drawField(presenter.iterateHorizontal());
    return drawer;
}
