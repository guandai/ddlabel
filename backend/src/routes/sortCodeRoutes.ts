const express = require('express');
const router = express.Router();
const sortCodeController = require('../controllers/sortCodeController');

router.get('/', sortCodeController.getAllSortCodes);
router.post('/', sortCodeController.createSortCode);
router.put('/:id', sortCodeController.updateSortCode);
router.delete('/:id', sortCodeController.deleteSortCode);

module.exports = router;
