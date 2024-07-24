"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCityState = void 0;
const stateSmall_json_1 = __importDefault(require("../data/stateSmall.json"));
const stData = stateSmall_json_1.default;
const getCityState = (zip, city, state) => {
    let info;
    if (city && state) {
        return { city, state };
    }
    info = getZipInfo(zip);
    if (!info) {
        throw new Error('Invalid zip code to get city and state');
    }
    return info;
};
exports.getCityState = getCityState;
const getZipInfo = (zip) => {
    const entry = stData.find(it => it.zip === zip);
    if (entry) {
        const { city, state, county } = entry;
        return { city: city, state: state, county: county };
    }
    return null;
};
exports.default = getZipInfo;
