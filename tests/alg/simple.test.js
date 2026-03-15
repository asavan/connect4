import test from "node:test";
import assert from "node:assert/strict";


import simple from "../../src/js/alg/simple.js";

test("simple", () => {
    const arr = simple.generateAllVariants(4, 6);
    assert.strictEqual(1296, arr.size);
    assert.ok(arr.has(1111), "fist included");
    assert.ok(arr.has(6666), "last included");
    assert.ok(arr.has(1234), "some included");
    assert.ok(arr.has(6543), "some included");
    // console.log(arr);
});
