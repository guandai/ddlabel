"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/package.ts
const express_1 = require("express");
const packageController_1 = require("../controllers/packageController");
const router = (0, express_1.Router)();
router.post('/', packageController_1.addPackage);
router.delete('/:id', packageController_1.deletePackage);
router.put('/:id', packageController_1.updatePackage);
router.get('/:id', packageController_1.getPackageDetails);
router.get('/', packageController_1.getPackages);
exports.default = router;
