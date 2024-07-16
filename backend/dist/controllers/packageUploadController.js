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
const BATCH_SIZE = 500; // You can adjust this batch size as needed
const importPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }
    const file = req.file;
    const { packageUserId } = req.body;
    const results = [];
    const io = req.io;
    const socketId = req.headers['socket-id'] || 'no-id';
    fs_1.default.createReadStream(file.path)
        .pipe((0, csv_parser_1.default)())
        .on('data', (data) => results.push(data))
        .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
        let packageBatch = [];
        let fromAddressBatch = [];
        let toAddressBatch = [];
        let processedCount = 0;
        for (const pkgData of results) {
            const { length, width, height, weight, reference, shipFromName, shipFromAddressStreet, shipFromAddressCity, shipFromAddressState, shipFromAddressZip, shipToName, shipToAddressStreet, shipToAddressCity, shipToAddressState, shipToAddressZip } = pkgData;
            const trackingNumber = (0, generateTrackingNumber_1.generateTrackingNumber)();
            const shipFromAddress = {
                name: shipFromName,
                addressLine1: shipFromAddressStreet,
                city: shipFromAddressCity,
                state: shipFromAddressState,
                zip: shipFromAddressZip,
            };
            const shipToAddress = {
                name: shipToName,
                addressLine1: shipToAddressStreet,
                city: shipToAddressCity,
                state: shipToAddressState,
                zip: shipToAddressZip,
            };
            fromAddressBatch.push(shipFromAddress);
            toAddressBatch.push(shipToAddress);
            packageBatch.push({
                userId: packageUserId,
                shipFromAddress,
                shipToAddress,
                length,
                width,
                height,
                weight,
                trackingNumber,
                reference,
            });
            if (packageBatch.length >= BATCH_SIZE) {
                yield processBatch(packageBatch, fromAddressBatch, toAddressBatch);
                packageBatch = [];
                fromAddressBatch = [];
                toAddressBatch = [];
                processedCount += BATCH_SIZE;
                io.to(socketId).emit('progress', {
                    processed: processedCount,
                    total: results.length
                });
            }
        }
        // Process any remaining data
        if (packageBatch.length > 0) {
            try {
                yield processBatch(packageBatch, fromAddressBatch, toAddressBatch);
                processedCount += packageBatch.length;
                io.to(socketId).emit('progress', {
                    processed: processedCount,
                    total: results.length
                });
            }
            catch (error) {
                console.error('Error processing batch', error);
                return res.status(500).send({ message: 'Error processBatch' });
            }
        }
        res.status(200).send({ message: 'Packages imported successfully' });
    })).on('error', (err) => {
        console.error('Error parsing CSV:', err);
        res.status(500).send({ message: 'Error importing packages' });
    });
});
exports.importPackages = importPackages;
const processBatch = (packageBatch, fromAddressBatch, toAddressBatch) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fromAddresses = yield Address_1.Address.bulkCreate(fromAddressBatch);
        const toAddresses = yield Address_1.Address.bulkCreate(toAddressBatch);
        const packages = packageBatch.map((pkg, index) => (Object.assign(Object.assign({}, pkg), { shipFromAddressId: fromAddresses[index].id, shipToAddressId: toAddresses[index].id })));
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
