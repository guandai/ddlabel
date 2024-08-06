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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getZipCodeFromFile = exports.getZipCode = void 0;
const ZipCode_1 = require("../models/ZipCode");
const getInfo_1 = __importDefault(require("../utils/getInfo"));
const getZipCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { zip } = req.params;
        const zipCode = yield ZipCode_1.ZipCode.findOne({ where: { zip } });
        if (!zipCode) {
            return res.status(404).json({ message: 'Zip code not found' });
        }
        return res.json(zipCode);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.getZipCode = getZipCode;
const getZipCodeFromFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const info = (0, getInfo_1.default)(req.params.zip);
    if (!info) {
        return res.status(404).json({ message: 'Zip code not found' });
    }
    return res.json({ zip: req.params.zip, city: info.city, state: info.state });
});
exports.getZipCodeFromFile = getZipCodeFromFile;
