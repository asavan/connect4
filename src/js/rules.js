export const EMPTY_CELL = 0;
export const FIRST_PLAYER = 1;
export const SECOND_PLAYER = 2;
export const VALIDATION_ERROR = -1;
export const GAME_CONTINUE = 3;
export const GAME_DRAW = 4;
export const DEFAULT_FIELD = [1, 1, 1, 1, 1, 1, 1];
export const DEFAULT_ROWS = 6;


export function parseIntToArr(num) {
    const binaryString = num.toString(2);
    return binaryString.split("").slice(1).map((x) => Number.parseInt(x, 10) + 1);
}

export function parseIntArr(intArr) {
    return intArr.map(parseIntToArr);
}

export function lastNonZero(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] !== EMPTY_CELL) {
            return i;
        }
    }
    return VALIDATION_ERROR;
}

export function engine(intArr, rows, maxLen, logger, assert) {
    const cols = intArr.length;
    const matrix = parseIntArr(intArr);

    const countMoves = () => {
        let first = 0;
        let second = 0;
        for (const col of matrix) {
            for (const x of col) {
                if (x === FIRST_PLAYER) {
                    ++first;
                }
                if (x === SECOND_PLAYER) {
                    ++second;
                }
            }
        }
        return {
            first, second
        };
    };
    const cm = countMoves();
    const diff = cm.first - cm.second;
    logger.log("diff", diff);
    assert(diff >= 0 && diff < 2, "Bad board");
    let curIndex = FIRST_PLAYER;
    if (cm.first > cm.second) {
        curIndex = SECOND_PLAYER;
    }
    let status = GAME_CONTINUE;
    logger.log(maxLen);
    const inBounds = (x, y) => x >= 0 && y >= 0 && y < cols && x < rows;
    const cell = (x, y) => {
        if (!inBounds(x, y)) {
            return VALIDATION_ERROR;
        }
        const col = matrix[y];
        if (col.length <= x) {
            return EMPTY_CELL;
        }
        return col[x];
    };

    const sameLen = (x, y, dx, dy, step, val) => {
        assert(val !== EMPTY_CELL);
        assert(val > 0);
        const newCell = cell(x + dx * step, y + dy * step);
        if (newCell !== val) {
            return step - 1;
        }
        return sameLen(x, y, dx, dy, step + 1, val);
    };

    const moveCands = () => {
        const res = [];
        let i = 0;
        for (const col of matrix) {
            if (col.length < rows) {
                res.push(i);
            }
            ++i;
        }
        return res;
    };

    const isWin = (x, y) => {
        const dd = [[1, 0], [0, 1], [1, 1], [1, -1]];
        const val = cell(x, y);
        let status = GAME_CONTINUE;
        assert(val === FIRST_PLAYER || val === SECOND_PLAYER, "Bad cell to check");
        let ii = 0;
        for (const d of dd) {
            const dx = d[0];
            const dy = d[1];
            const posLen = sameLen(x, y, dx, dy, 1, val);
            if (posLen + 1 >= maxLen) {
                logger.log("Win", posLen, maxLen, ii);
                status = val;
                break;
            }
            const negLen = sameLen(x, y, -dx, -dy, 1, val);
            if (posLen + negLen + 1 >= maxLen) {
                status = val;
                logger.log("Win", posLen, negLen, maxLen, ii);
                break;
            }
            const cands = moveCands();
            if (cands.length === 0) {
                status = GAME_DRAW;
                break;
            }
            ++ii;
        }
        return status;
    };

    const checkWinAfterMove = (y) => {
        const x = lastNonZero(matrix[y]);
        return isWin(x, y);
    };

    const checkCurrIndex = (index) => index === curIndex;

    const move = (y, index) => {
        if (!checkCurrIndex(index)) {
            return VALIDATION_ERROR;
        }
        if (status !== GAME_CONTINUE) {
            return VALIDATION_ERROR;
        }
        if (y < 0 || y >= cols) {
            return VALIDATION_ERROR;
        }
        const col = matrix[y];
        if (col.length >= rows) {
            return VALIDATION_ERROR;
        }
        const x = col.length;
        col.push(index);
        curIndex = FIRST_PLAYER + SECOND_PLAYER - curIndex;
        status = isWin(x, y);
        return status;
    };

    const iterateHorizontal = () => {
        const itHor = {
            * [Symbol.iterator]() {
                for (let j = rows; j > 0; --j) {
                    for (let i = 0; i < cols; ++i) {
                        const c = cell(j - 1, i);
                        if (c < 0) {
                            console.log({x: j-1, y: i});
                        }
                        assert(c >= 0);
                        yield c;
                    }
                }
            }
        };
        return itHor;
    };

    const width = () => cols;
    const height = () => rows;

    return {
        cell,
        checkWinAfterMove,
        move,
        iterateHorizontal,
        width,
        height
    };
}
