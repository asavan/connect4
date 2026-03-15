import test from "node:test";
import assert from "node:assert/strict";


import {commonArr, numToDigits} from "../src/js/solver.js";

test("numToDigits", () => {
    const arr = numToDigits(1234);
    assert.deepStrictEqual([1, 2, 3, 4], arr);
});

test("common", () => {
    const res = commonArr([1, 2, 3, 4], [1, 2, 4, 3]);
    assert.strictEqual(res, 22);
});

test("commonAll", () => {
    const res = commonArr([1, 2, 3, 4], [1, 2, 3, 4]);
    assert.strictEqual(res, 40);
});

test("commonNone", () => {
    const res = commonArr([5, 6, 3, 4], [1, 1, 2, 2]);
    assert.strictEqual(res, 0);
});
