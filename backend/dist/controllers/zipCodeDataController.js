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
exports.getZipCodeDataFromFile = exports.getAllZipCodeData = exports.getZipCodeData = void 0;
const ZipCodeData_1 = require("../models/ZipCodeData");
const getZipInfo_1 = __importDefault(require("../utils/getZipInfo"));
const getZipCodeData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { zip } = req.params;
        const data = yield ZipCodeData_1.ZipCodeData.findOne({ where: { zip } });
        if (!data) {
            return res.status(404).json({ message: 'Zip code not found' });
        }
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getZipCodeData = getZipCodeData;
const getAllZipCodeData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the page and pageSize from the query parameters, with default values
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;
        // Calculate the offset
        const offset = (page - 1) * pageSize;
        // Query the database with limit and offset for pagination
        const data = yield ZipCodeData_1.ZipCodeData.findAndCountAll({
            limit: pageSize,
            offset: offset,
        });
        // Calculate total pages
        const totalPages = Math.ceil(data.count / pageSize);
        // Return the paginated data, total items, and total pages
        res.json({
            page: page,
            pageSize: pageSize,
            totalItems: data.count,
            totalPages: totalPages,
            data: data.rows,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllZipCodeData = getAllZipCodeData;
const getZipCodeDataFromFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const info = (0, getZipInfo_1.default)(req.params.zip);
    if (!info) {
        return res.status(404).json({ message: 'Zip code not found' });
    }
    res.json({
        zip: req.params.zip,
        city: info.city,
        state: info.state,
    });
});
exports.getZipCodeDataFromFile = getZipCodeDataFromFile;
