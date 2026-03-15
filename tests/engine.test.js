import test from "node:test";
import assert from "node:assert/strict";


import engine from "../src/js/engine.js";

test("simple engine", () => {
    const eng = engine.fromString("1234");
    const verdict = eng.testStr("1234");
    assert.strictEqual(verdict, 40, "must be 40");
    assert.ok(eng.isWinNum(verdict), "verdict win");
    assert.ok(!eng.isWinNum(30), "verdict 30");

    const verdict2 = eng.testNum(1234);
    assert.strictEqual(verdict2, 40, "must be 40");
});
