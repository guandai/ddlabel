"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMapping = void 0;
var constants_1 = require("./constants");
exports.defaultMapping = constants_1.PKG_FIELDS.reduce(function (acc, field) {
    var _a;
    Object.assign(acc, (_a = {}, _a[field] = field, _a));
    return acc;
}, {});
