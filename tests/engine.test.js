import test from "node:test";
import assert from "node:assert/strict";


import {FIRST_PLAYER, lastNonZero, parseIntToArr, SECOND_PLAYER, VALIDATION_ERROR}
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
