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
exports.getPackageDetails = exports.editPackage = exports.deletePackage = exports.updatePackage = exports.getPackages = exports.addPackage = void 0;
const Package_1 = require("../models/Package");
const generateTrackingNumber_1 = require("../utils/generateTrackingNumber");
const addPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, shipFromAddress, shipToAddress, phone, length, width, height, weight, postCode, email, state, name } = req.body;
    const trackingNumber = (0, generateTrackingNumber_1.generateTrackingNumber)(); // Generate a tracking number
    try {
        const pkg = yield Package_1.Package.create({
            userId,
            shipFromAddress,
            shipToAddress,
            phone,
            length,
            width,
            height,
            weight,
            postCode,
            email,
            state,
            name,
            trackingNumber // Add the tracking number to the package
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
        const packages = yield Package_1.Package.findAll();
        res.json(packages);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getPackages = getPackages;
const updatePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shipFromAddress, shipToAddress, phone, length, width, height, weight, postCode, email, state, name } = req.body;
    try {
        const [rows, pkg] = yield Package_1.Package.update({ shipFromAddress, shipToAddress, phone, length, width, height, weight, postCode, email, state, name }, { where: { id: req.params.id }, returning: true });
        res.json(pkg);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updatePackage = updatePackage;
const deletePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
    const { shipFromAddress, shipToAddress, phone, length, width, height, weight, postCode, email, state, name } = req.body;
    try {
        const [updated] = yield Package_1.Package.update({
            shipFromAddress,
            shipToAddress,
            phone,
            length,
            width,
            height,
            weight,
            postCode,
            email,
            state,
            name
        }, {
            where: { id }
        });
        if (updated) {
            const updatedPackage = yield Package_1.Package.findOne({ where: { id } });
            res.status(200).json(updatedPackage);
        }
        else {
            throw new Error('Package not found');
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.editPackage = editPackage;
const getPackageDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const pkg = yield Package_1.Package.findOne({ where: { id } });
        if (pkg) {
            res.status(200).json(pkg);
        }
        else {
            throw new Error('Package not found');
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getPackageDetails = getPackageDetails;
