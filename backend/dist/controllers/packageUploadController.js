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
exports.uploadMiddleware = exports.importPackages = void 0;
const generateTrackingNo_1 = require("../utils/generateTrackingNo");
const multer_1 = __importDefault(require("multer"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const reportIo_1 = require("../utils/reportIo");
const logger_1 = __importDefault(require("../config/logger"));
const shared_1 = require("@ddlabel/shared");
const packageBatchFuntions_1 = require("./packageBatchFuntions");
const errors_1 = require("../utils/errors");
const BATCH_SIZE = 500;
const onData = ({ req, csvData, pkgAll }) => {
    const { packageCsvLength, packageCsvMap } = req.body;
    const prepared = (0, packageBatchFuntions_1.getPreparedData)(packageCsvMap, csvData);
    const userId = req.user.id;
    if (!prepared)
        return;
    const { mappedData, fromZipInfo, toZipInfo } = prepared;
    pkgAll.pkgBatch.push({
        userId,
        length: mappedData['length'] || 0,
        width: mappedData['width'] || 0,
        height: mappedData['height'] || 0,
        weight: mappedData['weight'] || 0,
        trackingNo: mappedData['trackingNo'] || (0, generateTrackingNo_1.generateTrackingNo)(),
        referenceNo: mappedData['referenceNo'],
        source: shared_1.PackageSource.api,
    });
    pkgAll.shipFromBatch.push(Object.assign(Object.assign({}, fromZipInfo), { name: mappedData['fromName'], userId, address1: mappedData['fromAddress1'], address2: mappedData['fromAddress2'], zip: mappedData['fromAddressZip'], addressType: shared_1.AddressEnum.fromPackage }));
    pkgAll.shipToBatch.push(Object.assign(Object.assign({}, toZipInfo), { name: mappedData['toName'], userId, address1: mappedData['toAddress1'], address2: mappedData['toAddress2'], zip: mappedData['toAddressZip'], addressType: shared_1.AddressEnum.toPackage }));
    (0, reportIo_1.reportIoSocket)('generate', req, pkgAll.pkgBatch.length, packageCsvLength);
    return;
};
const onEnd = (_a) => __awaiter(void 0, [_a], void 0, function* ({ stream, req, pkgAll }) {
    const { pkgBatch, shipFromBatch, shipToBatch } = pkgAll;
    let processed = 0;
    const batchData = {
        pkgBatch: [],
        shipFromBatch: [],
        shipToBatch: [],
    };
    const turns = Math.ceil(pkgBatch.length / BATCH_SIZE);
    for (let i = 0; i < turns; i++) {
        const start = i * BATCH_SIZE;
        const pkgDataSlice = pkgBatch.slice(start, start + BATCH_SIZE);
        const fromSlice = shipFromBatch.slice(start, start + BATCH_SIZE);
        const toSlice = shipToBatch.slice(start, start + BATCH_SIZE);
        batchData.shipFromBatch = fromSlice;
        batchData.shipToBatch = toSlice;
        batchData.pkgBatch = pkgDataSlice;
        try {
            yield (0, packageBatchFuntions_1.processBatch)(batchData);
            batchData.pkgBatch = [];
            batchData.shipFromBatch = [];
            batchData.shipToBatch = [];
            processed += pkgDataSlice.length;
            (0, reportIo_1.reportIoSocket)('insert', req, processed, pkgBatch.length);
            stream.emit('success');
        }
        catch (error) {
            logger_1.default.error(`Error in onEnd: ${error}`); // Log the detailed
            stream.emit('error', (0, errors_1.aggregateError)(error));
        }
    }
});
const importPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { file } = req;
    if (!file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }
    const pkgAll = {
        pkgBatch: [],
        shipFromBatch: [],
        shipToBatch: [],
    };
    const stream = fs_1.default.createReadStream(file.path);
    stream.pipe((0, csv_parser_1.default)())
        .on('data', (csvData) => onData({ req, csvData, pkgAll }))
        .on('end', () => __awaiter(void 0, void 0, void 0, function* () { return onEnd({ stream, req, pkgAll }); }));
    //  if .on('error')  follow the chain, the error can not be catched by stream
    stream.on('error', error => {
        logger_1.default.error(`Error in importPackages: ${error}`);
        return res.status(400).send({ message: `Importing Error: ${error}` });
    });
    stream.on('success', () => {
        return res.json({ message: `Importing Done!` });
    });
});
exports.importPackages = importPackages;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`);
    }
});
const upload = (0, multer_1.default)({ storage });
exports.uploadMiddleware = upload.single('packageCsvFile');
