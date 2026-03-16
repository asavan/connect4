import test from "node:test";
import assert from "node:assert/strict";


import {
    DEFAULT_COLS, DEFAULT_FIELD,
    EMPTY_CELL, engine, FIRST_PLAYER, lastNonZero, parseIntArr, parseIntToArr, SECOND_PLAYER, VALIDATION_ERROR
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
    const eng = engine(DEFAULT_FIELD, DEFAULT_COLS, 4, console, assert.ok);
    const topCell = eng.cell(0, 0);
    assert.strictEqual(topCell, EMPTY_CELL);
});

test("engine iter", () => {
    const eng = engine([1, 1], 2, 4, console, assert.ok);
    const iter = eng.iterateHorizontal();
    const res = [];
    for (const it of iter) {
        res.push(it);
    }
    assert.deepEqual(res, [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL]);
});

test("engine width", () => {
    const eng = engine([1, 1], 3, 4, console, assert.ok);
    assert.strictEqual(eng.width(), 2);
});
