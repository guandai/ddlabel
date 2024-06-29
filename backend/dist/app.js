"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/app.ts
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const packageRoutes_1 = __importDefault(require("./routes/packageRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const app = (0, express_1.default)();
// Middleware
app.use(body_parser_1.default.json());
// Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/packages', packageRoutes_1.default);
app.use('/api/transactions', transactionRoutes_1.default);
exports.default = app;
