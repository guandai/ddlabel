"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidJSON = void 0;
const isValidJSON = (str) => {
    try {
        JSON.parse(str);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.isValidJSON = isValidJSON;
