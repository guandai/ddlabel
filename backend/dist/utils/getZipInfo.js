"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stateData_json_1 = __importDefault(require("../data/stateData.json"));
const stData = stateData_json_1.default;
const getZipInfo = (zip) => {
    const entry = stData.data.find(it => it.zip === zip);
    if (entry) {
        return { city: entry.city, state: entry.state_name };
    }
    return null; // or throw an error, or return a default value
};
exports.default = getZipInfo;
