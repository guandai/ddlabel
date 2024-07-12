"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/postalZoneRoutes.ts
const express_1 = require("express");
const postalZoneController_1 = require("../controllers/postalZoneController");
const router = (0, express_1.Router)();
router.get('/', postalZoneController_1.getPostalZones);
router.get('/get_post_zone', postalZoneController_1.getPostalZoneByZip);
router.get('/get_zone', postalZoneController_1.getZoneByProposalAndZip);
router.get('/:id', postalZoneController_1.getPostalZoneById);
exports.default = router;
