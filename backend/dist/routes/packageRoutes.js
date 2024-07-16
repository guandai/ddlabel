"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/packageRoutes.ts
const express_1 = require("express");
const packageController_1 = require("../controllers/packageController");
const auth_1 = require("../middleware/auth");
const packageUploadController_1 = require("../controllers/packageUploadController");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, packageController_1.addPackage);
router.get('/', auth_1.authenticate, packageController_1.getPackages);
router.put('/:id', auth_1.authenticate, packageController_1.updatePackage);
router.delete('/:id', auth_1.authenticate, packageController_1.deletePackage);
router.get('/:id', auth_1.authenticate, packageController_1.getPackageDetails);
router.post('/import', auth_1.authenticate, packageUploadController_1.uploadMiddleware, packageUploadController_1.importPackages);
exports.default = router;
