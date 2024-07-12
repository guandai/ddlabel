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
exports.uploadMiddleware = exports.importPackages = exports.getPackageDetails = exports.editPackage = exports.deletePackage = exports.updatePackage = exports.getPackages = exports.addPackage = void 0;
const Package_1 = require("../models/Package");
const Address_1 = require("../models/Address");
const generateTrackingNumber_1 = require("../utils/generateTrackingNumber");
const User_1 = require("../models/User");
const multer_1 = __importDefault(require("multer"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const addPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, shipFromAddress, shipToAddress, length, width, height, weight, reference, warehouseZip } = req.body;
    const trackingNumber = (0, generateTrackingNumber_1.generateTrackingNumber)();
    try {
        const fromAddress = yield Address_1.Address.create(shipFromAddress);
        const toAddress = yield Address_1.Address.create(shipToAddress);
        const pkg = yield Package_1.Package.create({
            userId: user.id,
            shipFromAddressId: fromAddress.id,
            shipToAddressId: toAddress.id,
            length,
            width,
            height,
            weight,
            trackingNumber,
            reference,
            warehouseZip,
        });
        res.status(201).json(pkg);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.addPackage = addPackage;
const getPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const packages = yield Package_1.Package.findAll({
            include: [
                { model: Address_1.Address, as: 'shipFromAddress' },
                { model: Address_1.Address, as: 'shipToAddress' },
                { model: User_1.User, as: 'user' },
            ],
        });
        res.json(packages);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getPackages = getPackages;
const updatePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shipFromAddress, shipToAddress, length, width, height, weight } = req.body;
    try {
        const pkg = yield Package_1.Package.findByPk(req.params.id);
        if (!pkg) {
            throw new Error('Package not found');
        }
        yield Address_1.Address.update(shipFromAddress, { where: { id: pkg.shipFromAddressId } });
        yield Address_1.Address.update(shipToAddress, { where: { id: pkg.shipToAddressId } });
        yield pkg.update({ length, width, height, weight });
        res.json(pkg);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updatePackage = updatePackage;
const deletePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pkg = yield Package_1.Package.findByPk(req.params.id);
        if (!pkg) {
            throw new Error('Package not found');
        }
        yield Address_1.Address.destroy({ where: { id: pkg.shipFromAddressId } });
        yield Address_1.Address.destroy({ where: { id: pkg.shipToAddressId } });
        yield Package_1.Package.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Package deleted' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.deletePackage = deletePackage;
const editPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { shipFromAddress, shipToAddress, length, width, height, weight } = req.body;
    try {
        const pkg = yield Package_1.Package.findByPk(id);
        if (!pkg) {
            throw new Error('Package not found');
        }
        yield Address_1.Address.update(shipFromAddress, { where: { id: pkg.shipFromAddressId } });
        yield Address_1.Address.update(shipToAddress, { where: { id: pkg.shipToAddressId } });
        yield pkg.update({ length, width, height, weight });
        res.json(pkg);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.editPackage = editPackage;
const getPackageDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const pkg = yield Package_1.Package.findOne({
            where: { id },
            include: [
                { model: Address_1.Address, as: 'shipFromAddress' },
                { model: Address_1.Address, as: 'shipToAddress' },
                { model: User_1.User, as: 'user' },
            ],
        });
        if (!pkg) {
            throw new Error('Package not found');
        }
        res.json(pkg);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getPackageDetails = getPackageDetails;
const importPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }
    try {
        const file = req.file;
        const results = [];
        fs_1.default.createReadStream(file.path)
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => results.push(data))
            .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            for (const pkgData of results) {
                console.log(`pkgData`, pkgData);
                const { user, shipFromAddress, shipToAddress, length, width, height, weight, reference, warehouseZip } = pkgData;
                const trackingNumber = (0, generateTrackingNumber_1.generateTrackingNumber)();
                const fromAddress = yield Address_1.Address.create(shipFromAddress);
                const toAddress = yield Address_1.Address.create(shipToAddress);
                yield Package_1.Package.create({
                    userId: user.id,
                    shipFromAddressId: fromAddress.id,
                    shipToAddressId: toAddress.id,
                    length,
                    width,
                    height,
                    weight,
                    trackingNumber,
                    reference,
                    warehouseZip,
                });
            }
            res.status(200).send({ message: 'Packages imported successfully' });
        }));
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
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
exports.uploadMiddleware = upload.single('packageCsvFile'); // the same as PackageTable.tsx
