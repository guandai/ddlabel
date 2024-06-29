"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/transactionRoutes.ts
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const router = (0, express_1.Router)();
router.get('/', transactionController_1.getTransactions);
exports.default = router;
