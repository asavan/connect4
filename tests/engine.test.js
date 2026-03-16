import test from "node:test";
import assert from "node:assert/strict";


import {
    DEFAULT_ROWS, DEFAULT_FIELD,
    EMPTY_CELL, engine, FIRST_PLAYER, lastNonZero, parseIntArr, parseIntToArr, SECOND_PLAYER, VALIDATION_ERROR,
    GAME_CONTINUE
}
    from "../src/js/rules.js";

test("lastNonZero", () => {
    const x = lastNonZero([1, 2, 3]);
    assert.strictEqual(x, 2, "must be 2");
});

test("lastNonZero2", () => {
    const x = lastNonZero([1, 2, 3, 0]);
    assert.strictEqual(x, 2, "must be 2");
});

test("lastNonZero error", () => {
    const x = lastNonZero([]);
    assert.strictEqual(x, VALIDATION_ERROR, "must be error");
});

test("parseIntToArr empty", () => {
    const arr = parseIntToArr(1);
    assert.deepEqual(arr, []);
});

test("parseIntToArr", () => {
    const arr = parseIntToArr(5);
    assert.deepEqual(arr, [FIRST_PLAYER, SECOND_PLAYER]);
});

test("parseIntArr", () => {
    const arr = parseIntArr(DEFAULT_FIELD);
    assert.deepEqual(arr, [[], [], [], [], [], [], []]);
});


test("engine init", () => {
    const eng = engine(DEFAULT_FIELD, DEFAULT_ROWS, 4, console, assert.ok);
    const topCell = eng.cell(0, 0);
    assert.strictEqual(topCell, EMPTY_CELL);
});

test("engine iter", () => {
    const eng = engine([1, 1], 2, 4, console, assert.ok);
    const iter = eng.iterateHorizontal();
    const res = [...iter];
    assert.deepEqual(res, [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL]);
});

test("engine iter2", () => {
    const eng = engine([5, 1], 2, 4, console, assert.ok);
    const iter = eng.iterateHorizontal();
    const res = [...iter];
    assert.deepEqual(res, [SECOND_PLAYER, EMPTY_CELL, FIRST_PLAYER, EMPTY_CELL]);
});

test("engine iter3", () => {
    const eng = engine([5, 5, 5], 2, 4, console, assert.ok);
    const iter = eng.iterateHorizontal();
    const res = [...iter];
    assert.deepEqual(res, [SECOND_PLAYER, SECOND_PLAYER, SECOND_PLAYER, FIRST_PLAYER, FIRST_PLAYER, FIRST_PLAYER]);
});


test("engine width", () => {
    const eng = engine([1, 1], 3, 4, console, assert.ok);
    assert.strictEqual(eng.width(), 2);
});

test("engine move", () => {
    const eng = engine(DEFAULT_FIELD, DEFAULT_ROWS, 4, console, assert.ok);
    const res = eng.move(0, FIRST_PLAYER);
    assert.strictEqual(res, GAME_CONTINUE);
    const topCell = eng.cell(0, 0);
    assert.strictEqual(topCell, FIRST_PLAYER);
});

test("engine move and iter", () => {
    const eng = engine([1, 1, 1], 2, 4, console, assert.ok);
    const res = eng.move(0, FIRST_PLAYER);
    assert.strictEqual(res, GAME_CONTINUE);
    const topCell = eng.cell(0, 0);
    assert.strictEqual(topCell, FIRST_PLAYER);

    const iter = eng.iterateHorizontal();
    const arr = [...iter];
    console.log(arr);
    assert.deepEqual(arr, [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, FIRST_PLAYER, EMPTY_CELL, EMPTY_CELL]);
});
