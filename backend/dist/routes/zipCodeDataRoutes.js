"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/zipCodeDataRoutes.ts
const express_1 = require("express");
const zipCodeDataController_1 = require("../controllers/zipCodeDataController");
const router = (0, express_1.Router)();
router.get('/datafile/:zip', zipCodeDataController_1.getZipCodeDataFromFile); // Get data for all zip codes
router.get('/:zip', zipCodeDataController_1.getZipCodeData); // Get data for a specific zip code
router.get('/', zipCodeDataController_1.getAllZipCodeData); // Get data for all zip codes
exports.default = router;
