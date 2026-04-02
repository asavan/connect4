import {EMPTY_CELL, FIRST_PLAYER, SECOND_PLAYER} from "./rules.js";
import {assert, delay} from "netutils";

function drawItem(cell, item) {
    if (item === SECOND_PLAYER) {
        cell.classList.add("second");
    }
    if (item === FIRST_PLAYER) {
        cell.classList.add("first");
    }
    if (item === EMPTY_CELL) {
        cell.classList.add("empty");
    }
}

let currIndex = 0;
function changeColor(document) {
    ++currIndex;
    const colors = ["red", "orange"];
    const firstColor = colors[currIndex%2];
    const secondColor = colors[(currIndex+1)%2];
    document.documentElement.style.setProperty("--first-player", firstColor);
    document.documentElement.style.setProperty("--second-player", secondColor);
}

function drawActiveBall(logger, document, index, isMyMove) {
    const col3 = document.querySelector("[data-ind=\"ind3\"]");
    const ball = document.createElement("div");
    ball.classList.add("ball");
    ball.classList.add("active");
    drawItem(ball, index);
    if (!isMyMove) {
        ball.classList.add("wait");
    }
    ball.addEventListener("dblclick", (e) => {
        e.preventDefault();
        changeColor(document);
    });
    col3.append(ball);
}

function drawIter2(presenter, logger, document, field) {
    logger.log("Call draw", presenter.getRound());
    field.replaceChildren();
    for (let j = 0; j < presenter.width(); ++j) {
        const background = document.createElement("div");
        background.classList.add("back-col");
        background.dataset.ind = "ind" + j;
        field.append(background);
        background.addEventListener("click", (e) => {
            e.preventDefault();
            if (e.target.classList.contains("active")) {
                return;
            }
            const ind = j;
            logger.log("index", ind, presenter.getMyIndex());
            presenter.tryMove(ind, presenter.getMyIndex());
        });
        for (let i = 0; i < presenter.height(); ++i) {
            const cell = document.createElement("div");
            cell.classList.add("hole");
            const item = presenter.cell(presenter.height() - i - 1, j);
            assert(item >= 0);
            if (item > 0) {
                logger.log(presenter.height(), presenter.height() - i - 1, j);
            }
            drawItem(cell, item);
            background.append(cell);
        }
    }
    drawActiveBall(logger, document, presenter.getCurrIndex(), presenter.isMyTurn());
}

async function drawMove(logger, document, presenter, index, audioManager) {
    let ball = null;
    while (!ball) {
        ball = document.querySelector(".ball.active");
        if (ball) {
            break;
        }
        await delay(200);
    }
    ball.classList.remove("active", "wait");
    const xCoeff = index - 3;
    ball.style.setProperty("--x-coeff", xCoeff);
    await delay(100);
    audioManager.play("move");
    ball.classList.add("ball-animate");
    const yCoeff = presenter.emptySizeInCol(index) + 1;
    ball.style.setProperty("--y-coeff", yCoeff);
    await delay(300);
    drawActiveBall(logger, document, presenter.getCurrIndex(), presenter.isMyTurn());
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

function onGameEndDraw(res, overlay, field, reload, message, messageSmall) {
    field.classList.add("disabled");
    const h2 = overlay.querySelector("h2");
    h2.textContent = message;
    const content = overlay.querySelector(".content");
    content.textContent = messageSmall;
    overlay.classList.add("show");
    reload.classList.remove("hidden");
}

function onRoundStart(overlay, field, reload) {
    field.classList.remove("disabled");
    overlay.classList.remove("show");
    reload.classList.add("hidden");
}

export function draw(window, document, settings, presenter, logger) {
    document.documentElement.style.setProperty("--field-width", presenter.width());
    document.documentElement.style.setProperty("--field-height", presenter.height());
    const field = document.querySelector(".field");
    const reload = document.querySelector(".reload");

    field.classList.remove("disabled");
    reload.classList.add("hidden");
    const overlay = setupOverlay(document);
    const drawer = {
        drawByPresenter : () => drawIter2(presenter, logger, document, field),
        drawMove : (index, audioManager) => drawMove(logger, document, presenter, index, audioManager),
        onRoundStart: () => onRoundStart(overlay, field, reload),
        onGameEndDraw:
            (res, message, messageSmall) =>
                onGameEndDraw(res, overlay, field, reload, message, messageSmall)
    };

    reload.addEventListener("click", () => {
        logger.log("reload pressed");
        presenter.reloadClient(drawer);
    });

    presenter.setDrawer(drawer);
    drawer.drawByPresenter();
    return drawer;
}
