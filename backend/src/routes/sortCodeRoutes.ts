import { authenticate } from "../middleware/auth";

const express = require('express');
const router = express.Router();
const sortCodeController = require('../controllers/sortCodeController');

router.get('/', authenticate, sortCodeController.getAllSortCodes);
router.post('/', authenticate,sortCodeController.createSortCode);
router.put('/:id', authenticate, sortCodeController.updateSortCode);
router.delete('/:id', authenticate, sortCodeController.deleteSortCode);

module.exports = router;
