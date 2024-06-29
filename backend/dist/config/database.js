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
exports.connectDB = exports.sequelize = void 0;
// backend/src/config/database.ts
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Create a new Sequelize instance
const sequelize = new sequelize_1.Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: console.log,
});
exports.sequelize = sequelize;
// Import models
const User_1 = require("../models/User");
const Package_1 = require("../models/Package");
const Transaction_1 = require("../models/Transaction");
// Initialize model relationships if needed
Package_1.Package.belongsTo(User_1.User, { foreignKey: 'userId' });
Transaction_1.Transaction.belongsTo(Package_1.Package, { foreignKey: 'packageId' });
// Connect to the database and synchronize models
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log('Connection has been established successfully.');
        yield sequelize.sync();
        console.log('Database synchronized successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
exports.connectDB = connectDB;
