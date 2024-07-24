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
exports.getUsers = exports.getCurrentUser = exports.updateUser = exports.loginUser = exports.registerUser = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Address_1 = require("../models/Address");
const logger_1 = __importDefault(require("../config/logger"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, warehouseAddress } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    try {
        const warehouseAddressId = (yield Address_1.Address.createWithInfo(warehouseAddress)).id;
        const user = yield User_1.User.create({ name, email, password: hashedPassword, role, warehouseAddressId });
        res.status(201).json(user);
    }
    catch (error) {
        logger_1.default.error(error); // Log the detailed
        res.status(400).json({ message: error.message, errors: error.errors });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.User.findOne({ where: { email } });
        if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.json({ token, userId: user.id });
        }
        else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.loginUser = loginUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    user.id = parseInt(req.params.id, 10);
    try {
        if (user && user.password) {
            user.password = yield bcryptjs_1.default.hash(user.password, 10);
        }
        yield Address_1.Address.updateWithInfo(user.warehouseAddress, user.warehouseAddressId);
        const response = yield User_1.User.update(user, { where: { id: req.params.id } });
        res.json(response);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateUser = updateUser;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const user = yield User_1.User.findOne({
        where: { id: req.user.id },
        include: [
            { model: Address_1.Address, as: 'warehouseAddress' },
        ],
    });
    if (!user) {
        throw new Error('User not found');
    }
    const { name, id, email, role, warehouseAddressId, warehouseAddress } = user;
    const filteredUser = { name, id, email, role, warehouseAddressId, warehouseAddress };
    res.json(filteredUser);
});
exports.getCurrentUser = getCurrentUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.findAll({
            attributes: ['id', 'name', 'email', 'role'],
            include: [
                { model: Address_1.Address, as: 'warehouseAddress' },
            ],
        }); // Fetch selected attributes
        res.json(users);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getUsers = getUsers;
