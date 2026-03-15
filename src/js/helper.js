"use strict";

export function assert(b, message) {
    if (b) {
        return;
    }
    console.error(message);
    throw message;
}

export function pluralize(count, noun, suffix = "s") {
    return `${count} ${noun}${count !== 1 ? suffix : ""}`;
}
