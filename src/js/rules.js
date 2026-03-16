export const EMPTY_CELL = 0;
export const FIRST_PLAYER = 1;
export const SECOND_PLAYER = 2;
export const VALIDATION_ERROR = -1;


export function parseIntToArr(num) {
    const binaryString = num.toString(2);
    return binaryString.split("");
}

export function parseIntArr(intArr) {
    return intArr.map(parseIntToArr);
}

export function lastNonZero(arr) {
    let i = 0;
    for (const x of arr) {
        if (x === 0) {
            break;
        }
        ++i;
    }
    return i - 1;
}

export function engine(intArr, cols, rows) {
    const matrix = parseIntArr(intArr);
    const inBounds = (x, y) => x >= 0 && y >= 0 && x < cols && y < rows;
    const checkWinAfterMove = (y) => {
        const x = lastNonZero(matrix[y]);
        const val = matrix[y][x];

        return val;
    };
    const cell = (x, y) => {
        if (!inBounds(x, y)) {
            return VALIDATION_ERROR;
        }
        const col = matrix[y];
        if (col.length < x) {
            return EMPTY_CELL;
        }
        return col[x];
    };
    return {
        cell,
        checkWinAfterMove
    };
}
