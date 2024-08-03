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
exports.getUsers = exports.getCurrentUser = exports.updateCurrentUser = exports.loginUser = exports.registerUser = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Address_1 = require("../models/Address");
const logger_1 = __importDefault(require("../config/logger"));
const errors_1 = require("../utils/errors");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, warehouseAddress } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    try {
        const user = yield User_1.User.create({ name, email, password: hashedPassword, role });
        warehouseAddress.userId = user.id;
        yield Address_1.Address.createWithInfo(warehouseAddress);
        return res.status(201).json({ success: true, userId: user.id });
    }
    catch (error) {
        logger_1.default.error(error); // Log the detailed
        return res.status(400).json({ message: (0, errors_1.aggregateError)(error), error });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'user email not exist' });
        }
        if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.json({ token, userId: user.id });
        }
        else {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.loginUser = loginUser;
const updateCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
    }
    try {
        const user = req.body;
        user.id = req.user.id;
        if (user.password) {
            user.password = yield bcryptjs_1.default.hash(user.password, 10);
        }
        else {
            delete user.password;
        }
        yield Address_1.Address.updateWithInfo(user.warehouseAddress);
        const [affectedCount] = yield User_1.User.update(user, { where: { id: user.id } });
        const result = { success: affectedCount > 0 };
        return res.json(result);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.updateCurrentUser = updateCurrentUser;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notFound = () => res.status(404).json({ message: 'User not found' });
    if (!req.user) {
        return notFound();
    }
    ;
    const user = yield User_1.User.findOne({
        where: { id: req.user.id },
        attributes: ['id', 'name', 'email', 'role'],
        include: [
            { model: Address_1.Address, as: 'warehouseAddress' },
        ],
    });
    if (!user) {
        return notFound();
    }
    ;
    return res.json({ user });
});
exports.getCurrentUser = getCurrentUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.findAll({
            attributes: ['id', 'name', 'email', 'role'],
            include: [
                { model: Address_1.Address, as: 'warehouseAddress' },
            ],
        });
        return res.json({ users });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.getUsers = getUsers;
