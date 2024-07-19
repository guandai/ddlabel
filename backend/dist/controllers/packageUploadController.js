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
const Package_1 = require("../models/Package");
const Address_1 = require("../models/Address");
const generateTrackingNumber_1 = require("../utils/generateTrackingNumber");
const multer_1 = __importDefault(require("multer"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getZipInfo_1 = __importDefault(require("../utils/getZipInfo"));
const reportIo_1 = require("../utils/reportIo");
const errors_1 = require("../utils/errors");
const BATCH_SIZE = 500;
const FIELDS = [
    'length', 'width', 'height', 'weight', 'reference',
    'shipFromName', 'shipFromAddressStreet', 'shipFromAddressZip',
    'shipToName', 'shipToAddressStreet', 'shipToAddressZip'
];
const ExtraFields = ['shipFromAddressCity', 'shipFromAddressState', 'shipToAddressCity', 'shipToAddressState'];
const defaultMapping = FIELDS.reduce((acc, field) => {
    Object.assign(acc, { [field]: field });
    return acc;
}, {});
const getMappingData = (data, mapping) => {
    return FIELDS.reduce((acc, field) => {
        const csvHeader = mapping[field];
        return Object.assign(acc, { [field]: data[csvHeader] });
    }, {});
};
const onEndData = (req, res, pkgAll) => __awaiter(void 0, void 0, void 0, function* () {
    const { pkgBatch, fromBatch, toBatch } = pkgAll;
    let processed = 0;
    const batchData = {
        pkgBatch: [],
        fromBatch: [],
        toBatch: [],
    };
    const turns = Math.ceil(pkgBatch.length / BATCH_SIZE);
    for (let i = 0; i < turns; i++) {
        const start = i * BATCH_SIZE;
        const pkgDataSlice = pkgBatch.slice(start, start + BATCH_SIZE);
        const shipFromSlice = fromBatch.slice(start, start + BATCH_SIZE);
        const shipToSlice = toBatch.slice(start, start + BATCH_SIZE);
        batchData.fromBatch = shipFromSlice;
        batchData.toBatch = shipToSlice;
        batchData.pkgBatch = pkgDataSlice;
        try {
            yield processBatch(batchData);
            batchData.pkgBatch = [];
            batchData.fromBatch = [];
            batchData.toBatch = [];
            processed += pkgDataSlice.length;
            (0, reportIo_1.reportIoSocket)('insert', req, processed, pkgBatch.length);
        }
        catch (error) {
            console.error('Error processing batch', error);
            return res.status(500).send({ message: 'Error processing batch' });
        }
    }
    res.status(200).send({ message: 'PkgBatch imported successfully' });
});
const getPreparedData = (packageCsvMap, data) => {
    const mapping = (0, errors_1.isValidJSON)(packageCsvMap) ? JSON.parse(packageCsvMap) : defaultMapping;
    const mappedData = getMappingData(data, mapping);
    const addressFrom = (0, getZipInfo_1.default)(mappedData['shipFromAddressZip']);
    const addressTo = (0, getZipInfo_1.default)(mappedData['shipToAddressZip']);
    if (!addressFrom) {
        console.error(`has no From ZipInfo for ${mappedData['shipFromAddressZip']}`);
        return;
    }
    if (!addressTo) {
        console.error(`has no To ZipInfo for ${mappedData['shipToAddressZip']}`);
        return;
    }
    return {
        mappedData,
        addressFrom,
        addressTo,
    };
};
const onData = (OnDataParams) => {
    const { req, csvData, pkgAll } = OnDataParams;
    const { packageCsvLength, packageUserId, packageCsvMap } = req.body;
    const prepared = getPreparedData(packageCsvMap, csvData);
    if (!prepared)
        return;
    const { mappedData, addressFrom, addressTo } = prepared;
    pkgAll.pkgBatch.push({
        userId: packageUserId,
        length: mappedData['length'],
        width: mappedData['width'],
        height: mappedData['height'],
        weight: mappedData['weight'],
        trackingNumber: (0, generateTrackingNumber_1.generateTrackingNumber)(),
        reference: mappedData['reference'],
    });
    pkgAll.fromBatch.push(Object.assign(Object.assign({}, addressFrom), { name: mappedData['shipFromName'], addressLine1: mappedData['shipFromAddressStreet'], zip: mappedData['shipFromAddressZip'] }));
    pkgAll.toBatch.push(Object.assign(Object.assign({}, addressTo), { name: mappedData['shipToName'], addressLine1: mappedData['shipToAddressStreet'], zip: mappedData['shipToAddressZip'] }));
    (0, reportIo_1.reportIoSocket)('generate', req, pkgAll.pkgBatch.length, packageCsvLength);
    return;
};
const importPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, file } = req;
    if (!file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }
    const pkgAll = {
        pkgBatch: [],
        fromBatch: [],
        toBatch: [],
    };
    fs_1.default.createReadStream(file.path)
        .pipe((0, csv_parser_1.default)())
        .on('data', (csvData) => onData({ req, csvData, pkgAll }))
        .on('end', () => __awaiter(void 0, void 0, void 0, function* () { return onEndData(req, res, pkgAll); }))
        .on('error', (err) => {
        console.error('Error parsing CSV:', err);
        res.status(500).send({ message: 'Error importing pkgBatch' });
    });
});
exports.importPackages = importPackages;
const processBatch = (batchData) => __awaiter(void 0, void 0, void 0, function* () {
    const { pkgBatch, fromBatch, toBatch } = batchData;
    try {
        const fromAddresses = yield Address_1.Address.bulkCreate(fromBatch);
        const toAddresses = yield Address_1.Address.bulkCreate(toBatch);
        const packages = pkgBatch.map((pkg, index) => (Object.assign(Object.assign({}, pkg), { shipFromAddressId: fromAddresses[index].id, shipToAddressId: toAddresses[index].id })));
        yield Package_1.Package.bulkCreate(packages);
    }
    catch (error) {
        console.error('Error processing batch', error);
        throw new Error('Batch processing failed');
    }
});
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
