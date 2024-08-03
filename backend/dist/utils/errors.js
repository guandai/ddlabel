"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnMsg = exports.aggregateError = exports.isValidJSON = void 0;
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
const aggregateError = (error) => (error === null || error === void 0 ? void 0 : error.constructor.name) === 'UniqueConstraintError' && 'errors' in error
    ? error.errors.map((e) => e.message).join(', ')
    : error === null || error === void 0 ? void 0 : error.message;
exports.aggregateError = aggregateError;
const ReturnMsg = (res, message, code = 400) => res.status(code).json({ message });
exports.ReturnMsg = ReturnMsg;
