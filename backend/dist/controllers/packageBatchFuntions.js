"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.processBatch = exports.getPreparedData = void 0;
// backend/src/controllers/packageBatchFuntions.ts
const Package_1 = require("../models/Package");
const Address_1 = require("../models/Address");
const getInfo_1 = __importStar(require("../utils/getInfo"));
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../config/logger"));
const shared_1 = require("@ddlabel/shared");
const getMappingData = (headers, headerMapping) => {
    return shared_1.CSV_KEYS.reduce((acc, csvKey) => {
        const csvFileHeader = headerMapping[csvKey];
        return Object.assign(acc, { [csvKey]: !!csvFileHeader ? headers[csvFileHeader] : null });
    }, {});
};
const getPreparedData = (packageCsvMap, csvData) => __awaiter(void 0, void 0, void 0, function* () {
    const headerMapping = (0, errors_1.isValidJSON)(packageCsvMap) ? JSON.parse(packageCsvMap) : shared_1.defaultMapping;
    const mappedData = getMappingData(csvData, headerMapping);
    const fromZipInfo = (0, getInfo_1.default)((0, getInfo_1.getFromAddressZip)(mappedData));
    const toZipInfo = (0, getInfo_1.default)((0, getInfo_1.getToAddressZip)(mappedData));
    if (!fromZipInfo) {
        logger_1.default.error(`Error in getPreparedData: no fromAddressZip, ${mappedData['fromAddressZip']}`);
        return;
    }
    if (!toZipInfo) {
        logger_1.default.error(`Error in getPreparedData: no toAddressZip, ${mappedData['toAddressZip']}`);
        return;
    }
    return {
        mappedData,
        fromZipInfo,
        toZipInfo,
    };
});
exports.getPreparedData = getPreparedData;
const processBatch = (batchData) => __awaiter(void 0, void 0, void 0, function* () {
    const { pkgBatch, shipFromBatch, shipToBatch } = batchData;
    try {
        const packages = yield Package_1.Package.bulkCreate(pkgBatch);
        packages.map((pkg, idx) => {
            shipFromBatch[idx].fromPackageId = pkg.id;
            shipToBatch[idx].toPackageId = pkg.id;
        });
        yield Address_1.Address.bulkCreateWithInfo(shipFromBatch);
        yield Address_1.Address.bulkCreateWithInfo(shipToBatch);
    }
    catch (error) {
        logger_1.default.error(`Error in processBatch: ${(0, errors_1.reducedError)(error)}`);
        throw error;
    }
});
exports.processBatch = processBatch;
