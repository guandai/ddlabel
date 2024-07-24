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
exports.getPackageDetails = exports.deletePackage = exports.updatePackage = exports.getPackages = exports.addPackage = void 0;
const Package_1 = require("../models/Package");
const Address_1 = require("../models/Address");
const generateTrackingNumber_1 = require("../utils/generateTrackingNumber");
const User_1 = require("../models/User");
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("../config/logger"));
const addPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const { shipFromAddress, shipToAddress, length, width, height, weight, reference } = req.body;
    const trackingNumber = (0, generateTrackingNumber_1.generateTrackingNumber)();
    try {
        const shipFromAddressId = (yield Address_1.Address.createWithInfo(shipFromAddress)).id;
        const shipToAddressId = (yield Address_1.Address.createWithInfo(shipToAddress)).id;
        const pkg = yield Package_1.Package.create({
            userId: req.user.id,
            shipFromAddressId,
            shipToAddressId,
            length,
            width,
            height,
            weight,
            trackingNumber,
            reference,
        });
        res.status(201).json(pkg);
    }
    catch (error) {
        logger_1.default.error(error); // Log the detailed error
        res.status(400).json({ message: error.message, errors: error.errors });
    }
});
exports.addPackage = addPackage;
const getPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = parseInt(req.query.limit) || 100; // Default limit to 20 if not provided
    const offset = parseInt(req.query.offset) || 0; // 
    const userId = req.user.id;
    const search = req.query.search; // 
    try {
        const total = (yield Package_1.Package.count({ where: { userId } })) || 0;
        const whereCondition = search
            ? {
                userId,
                trackingNumber: {
                    [sequelize_1.Op.like]: `%${search}%`,
                },
            }
            : { userId };
        const packages = yield Package_1.Package.findAll({
            include: [
                { model: Address_1.Address, as: 'shipFromAddress' },
                { model: Address_1.Address, as: 'shipToAddress' },
                { model: User_1.User, as: 'user' },
            ],
            where: whereCondition,
            limit,
            offset,
        });
        res.json({ total, packages });
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
        yield Address_1.Address.updateWithInfo(shipFromAddress, pkg.shipFromAddressId);
        yield Address_1.Address.updateWithInfo(shipToAddress, pkg.shipToAddressId);
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
