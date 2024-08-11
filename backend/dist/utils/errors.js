"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDateValid = exports.ReturnMsg = exports.aggregateError = exports.reducedError = exports.isValidJSON = void 0;
const moment_1 = __importDefault(require("moment"));
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
const reducedError = (error) => {
    const stacks = error.stack.split('\n');
    const lastFnName = stacks.pop().split(' ')[5];
    const messages = [
        ['name', error.name],
        ['original', error.original],
        ['errors', error.errors.map((e) => e.message)],
        ['lastName', lastFnName],
    ];
    return `\n${messages.map(msg => `ReducedError [${msg[0]}]: ${msg[1]}`).join('\n')}`;
};
exports.reducedError = reducedError;
const aggregateError = (error) => (error === null || error === void 0 ? void 0 : error.constructor.name) === 'UniqueConstraintError' && 'errors' in error
    ? error.errors.map((e) => `${e.message}, ${error.original.message}`).join(', ')
    : error === null || error === void 0 ? void 0 : error.message;
exports.aggregateError = aggregateError;
const ReturnMsg = (res, message, code = 400) => res.status(code).json({ message });
exports.ReturnMsg = ReturnMsg;
const isDateValid = (date) => (0, moment_1.default)(date, moment_1.default.ISO_8601, true).isValid();
exports.isDateValid = isDateValid;
