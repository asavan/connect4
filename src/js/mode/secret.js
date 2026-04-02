import {delay} from "netutils";

export default async function secretMode(window, document, settings) {
    document.documentElement.style.setProperty("--field-width", settings.width);
    document.documentElement.style.setProperty("--field-height", settings.height);
    const field = document.querySelector(".field");
    field.replaceChildren();
    for (let j = 0; j < 7; ++j) {
        const background = document.createElement("div");
        background.classList.add("back-col");
        background.dataset.ind = "ind" + j;
        field.append(background);
        for (let i = 0; i < 6; ++i) {
            const cell = document.createElement("div");
            cell.classList.add("hole");
            background.append(cell);
        }
    }

    const col3 = document.querySelector("[data-ind=\"ind3\"]");

    console.log(col3);
    const ball = document.createElement("div");
    ball.classList.add("ball");
    col3.append(ball);
    await delay(200);
    ball.style.setProperty("--x-coeff", 3);
    await delay(500);
    ball.classList.add("ball-animate");
    ball.style.setProperty("--y-coeff", 5);
    // await delay(200);
}
