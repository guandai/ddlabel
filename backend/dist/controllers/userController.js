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
exports.getUsers = exports.getCurrentUser = exports.editUser = exports.loginUser = exports.registerUser = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, warehouseAddress, warehouseZip } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    try {
        const user = yield User_1.User.create({ name, email, password: hashedPassword, role, warehouseAddress, warehouseZip });
        res.status(201).json(user);
    }
    catch (error) {
        console.error(error); // Log the detailed error
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
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, warehouseAddress } = req.body;
    try {
        const updates = { name, email, role, warehouseAddress };
        if (password) {
            updates.password = yield bcryptjs_1.default.hash(password, 10);
        }
        const [rows, user] = yield User_1.User.update(updates, { where: { id: req.params.id }, returning: true });
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.editUser = editUser;
const getCurrentUser = (req, res) => {
    if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(req.user);
};
exports.getCurrentUser = getCurrentUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.findAll({ attributes: ['id', 'name', 'email', 'role', 'warehouseAddress'] }); // Fetch selected attributes
        res.json(users);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getUsers = getUsers;
