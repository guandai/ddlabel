"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/shippingRateRoutes.ts
const express_1 = require("express");
const shippingRateController_1 = require("../controllers/shippingRateController");
const router = (0, express_1.Router)();
router.get('/', shippingRateController_1.getShippingRates);
router.get('/simple-rate', shippingRateController_1.getSimpleRate);
router.get('/full-rate', shippingRateController_1.getFullRate);
exports.default = router;
