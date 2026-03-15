import test from "node:test";
import assert from "node:assert/strict";


import simple from "../../src/js/alg/simple.js";
import knuthGuesser from "../../src/js/alg/knuth.js";
import runner from "../../src/js/alg/runner.js";
import engine from "../../src/js/engine.js";

test("knuth fast average", () => {
    const allVariants = simple.generateAllVariants(4, 6);
    let allCount = 0;
    let maxCount = 0;
    for (const variant of allVariants) {
        const eng = engine.fromNum(variant);
        const guesser = knuthGuesser.fast();
        const count = runner(guesser, eng, []);
        maxCount = Math.max(maxCount, count);
        allCount += count;
    }
    console.log("knuth fast average", allCount, maxCount);
    assert.strictEqual(maxCount, 5, "too long");
    assert.ok(allCount < 5 * 1296, "too long");
});

test("knuth random fast average", () => {
    const allVariants = simple.generateAllVariants(4, 6);
    let allCount = 0;
    let maxCount = 0;
    for (const variant of allVariants) {
        const eng = engine.fromNum(variant);
        const guesser = knuthGuesser.random_fast();
        const count = runner(guesser, eng, []);
        maxCount = Math.max(maxCount, count);
        allCount += count;
    }
    console.log("knuth random fast average", allCount, maxCount);
    assert.ok(maxCount <= 6, "too long");
    assert.ok(allCount < 5 * 1296, "too long");
});
