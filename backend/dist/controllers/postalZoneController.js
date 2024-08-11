"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getZone = exports.getPostalZone = void 0;
// backend/src/controllers/postalZoneController.ts
const PostalZone_1 = require("../models/PostalZone");
const errors_1 = require("../utils/errors");
const getPostalZone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { zip } = req.query;
        if (!zip || typeof zip !== 'string') {
            return (0, errors_1.ReturnMsg)(res, '!Zip code is required');
        }
        const postalZone = yield PostalZone_1.PostalZone.findOne({
            where: { zip },
        });
        if (postalZone) {
            return res.json({ postalZone });
        }
        else {
            return (0, errors_1.ReturnMsg)(res, `PostalZone not found by zip ${zip}`, 422);
        }
    }
    catch (error) {
        return (0, errors_1.ReturnMsg)(res, `getPostalZone Err: ${error.message}`);
    }
});
exports.getPostalZone = getPostalZone;
const getZone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fromZip, toZip } = req.query;
    if (typeof fromZip !== 'string' || typeof toZip !== 'string') {
        return (0, errors_1.ReturnMsg)(res, 'fromZip and toZip code should be string');
    }
    try {
        const fromPostalZone = yield PostalZone_1.PostalZone.findOne({ where: { zip: fromZip } });
        const toPostalZone = yield PostalZone_1.PostalZone.findOne({ where: { zip: toZip } });
        if (!fromPostalZone) {
            return (0, errors_1.ReturnMsg)(res, `Can Not find From PostalZone by zip ${fromZip}`, 422);
        }
        if (!toPostalZone) {
            return (0, errors_1.ReturnMsg)(res, `Can Not find To PostalZone by zip ${toZip}`, 422);
        }
        const zone = toPostalZone === null || toPostalZone === void 0 ? void 0 : toPostalZone[fromPostalZone.proposal];
        if (!zone || zone === '-') {
            return (0, errors_1.ReturnMsg)(res, `No Avaliable Zone from ${fromPostalZone.proposal} to ${toPostalZone.proposal}`, 422);
        }
        return res.json({ zone });
    }
    catch (error) {
        return (0, errors_1.ReturnMsg)(res, error.message);
    }
});
exports.getZone = getZone;
