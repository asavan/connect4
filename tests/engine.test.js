import test from "node:test";
import assert from "node:assert/strict";


import {lastNonZero} from "../src/js/rules.js";

test("lastNonZero", () => {
    const x = lastNonZero([1, 2, 3]);
    assert.strictEqual(x, 2, "must be 2");
});

test("lastNonZero2", () => {
    const x = lastNonZero([1, 2, 3, 0]);
    assert.strictEqual(x, 2, "must be 2");
});
