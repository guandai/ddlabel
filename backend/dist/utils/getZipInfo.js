"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixCityState = void 0;
const stateSmall_json_1 = __importDefault(require("../data/stateSmall.json"));
const stData = stateSmall_json_1.default;
const fixCityState = (attr) => {
    if (attr.city && attr.state) {
        return attr;
    }
    const info = getZipInfo(attr.zip)
        || getZipInfo(getZipFromAddress(attr.address2 || ''))
        || getZipInfo(getZipFromAddress(attr.address1));
    if (!info) {
        throw new Error('Zip code not found');
    }
    return Object.assign(Object.assign({}, attr), { city: info.city, state: info.state });
};
exports.fixCityState = fixCityState;
const getZipFromAddress = (address) => {
    const zip = address.match(/\b\d{5}\b/);
    return zip ? zip[0] : '';
};
const getZipInfo = (zip) => {
    if (!zip) {
        return null;
    }
    const entry = stData.find(it => it.zip === zip);
    return entry || null;
};
exports.default = getZipInfo;
