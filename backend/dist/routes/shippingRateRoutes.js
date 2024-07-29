"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/shippingRateRoutes.ts
const express_1 = require("express");
const shippingRateController_1 = require("../controllers/shippingRateController");
const router = (0, express_1.Router)();
// router.get('/', getShippingRates);
router.get('/full-rate', shippingRateController_1.getFullRate);
exports.default = router;
