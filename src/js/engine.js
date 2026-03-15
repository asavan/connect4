import {common, commonArr, numToDigits} from "./solver.js";

function init(secArr) {
    function testNum(num) {
        return commonArr(secArr.slice(), numToDigits(num));
    }

    function testStr(str) {
        return common(secArr, str);
    }

    function isWinNum(verdict) {
        return verdict === secArr.length * 10;
    }

    return {
        testNum,
        isWinNum,
        testStr
    };
}

function fromString(str) {
    return init(Array.from(str).map((i) => parseInt(i, 10)));
}

function fromNum(num) {
    return init(numToDigits(num));
}

export default {
    fromString,
    fromNum
};

