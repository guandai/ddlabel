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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackage = exports.deletePackage = exports.updatePackage = exports.getPackages = exports.createPackage = void 0;
const Package_1 = require("../models/Package");
const Address_1 = require("../models/Address");
const User_1 = require("../models/User");
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("../config/logger"));
const shared_1 = require("@ddlabel/shared");
const generateTrackingNo_1 = require("../utils/generateTrackingNo");
const createPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const { fromAddress, toAddress, length, width, height, weight, referenceNo, trackingNo } = req.body;
    const userId = req.user.id;
    try {
        const pkg = yield Package_1.Package.create({
            userId,
            length: length || 0,
            width: width || 0,
            height: height || 0,
            weight,
            trackingNo: trackingNo || (0, generateTrackingNo_1.generateTrackingNo)(),
            referenceNo,
            source: shared_1.PackageSource.manual,
        });
        toAddress.toPackageId = fromAddress.fromPackageId = pkg.id;
        toAddress.fromPackageId = fromAddress.toPackageId = undefined;
        toAddress.userId = fromAddress.userId = userId;
        toAddress.addressType = shared_1.AddressEnum.toPackage;
        fromAddress.addressType = shared_1.AddressEnum.fromPackage;
        yield Address_1.Address.createWithInfo(fromAddress);
        yield Address_1.Address.createWithInfo(toAddress);
        return res.status(201).json({ success: true, packageId: pkg.id });
    }
    catch (error) {
        logger_1.default.error(error); // Log the detailed error
        return res.status(400).json({ message: error.message, error: error.errors });
    }
});
exports.createPackage = createPackage;
const getPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = parseInt(req.query.limit) || 100; // Default limit to 20 if not provided
    const offset = parseInt(req.query.offset) || 0; // 
    const userId = req.user.id;
    const search = req.query.search;
    try {
        const total = (yield Package_1.Package.count({ where: { userId } })) || 0;
        const whereCondition = search ? { userId, trackingNo: { [sequelize_1.Op.like]: `%${search}%` } } : { userId };
        const packages = yield Package_1.Package.findAll({
            include: [
                { model: Address_1.Address, as: 'fromAddress', where: { addressType: 'fromPackage' } },
                { model: Address_1.Address, as: 'toAddress', where: { addressType: 'toPackage' } },
                { model: User_1.User, as: 'user' },
            ],
            where: whereCondition,
            limit,
            offset,
        });
        return res.json({ total, packages });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.getPackages = getPackages;
const updatePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { fromAddress, toAddress } = _a, rest = __rest(_a, ["fromAddress", "toAddress"]);
    try {
        const pkg = yield Package_1.Package.findByPk(req.params.id);
        if (!pkg) {
            return res.status(400).json({ message: 'Package not found' });
        }
        yield Address_1.Address.updateWithInfo(fromAddress);
        yield Address_1.Address.updateWithInfo(toAddress);
        yield pkg.update(rest);
        return res.json(pkg);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.updatePackage = updatePackage;
const deletePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pkg = yield Package_1.Package.findByPk(req.params.id);
        if (!pkg) {
            return res.status(400).json({ message: 'Package not found' });
        }
        yield Address_1.Address.destroy({ where: { fromPackageId: pkg.id } });
        yield Address_1.Address.destroy({ where: { toPackageId: pkg.id } });
        yield Package_1.Package.destroy({ where: { id: pkg.id } });
        return res.json({ message: 'Package deleted' });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.deletePackage = deletePackage;
const getPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const pkg = yield Package_1.Package.findOne({
            where: { id },
            include: [
                { model: Address_1.Address, as: 'fromAddress' },
                { model: Address_1.Address, as: 'toAddress' },
                { model: User_1.User, as: 'user' },
            ],
        });
        if (!pkg) {
            return res.status(400).json({ message: 'Package not found' });
        }
        return res.json({ package: pkg });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.getPackage = getPackage;
