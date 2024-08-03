"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, userController_1.getUsers); // Add this line to fetch all users
router.post('/register', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.get('/me', auth_1.authenticate, userController_1.getCurrentUser);
router.put('/me', auth_1.authenticate, userController_1.updateCurrentUser);
exports.default = router;
