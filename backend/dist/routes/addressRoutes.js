"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/addressRoutes.ts
const express_1 = require("express");
const addressController_1 = require("../controllers/addressController");
const router = (0, express_1.Router)();
router.post('/', addressController_1.createAddress);
router.get('/', addressController_1.getAddresses);
router.get('/:id', addressController_1.getAddressById);
router.put('/:id', addressController_1.updateAddress);
router.delete('/:id', addressController_1.deleteAddress);
exports.default = router;
