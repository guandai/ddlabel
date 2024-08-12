import { Router } from 'express';
import { registerUser, loginUser, updateCurrentUser, getCurrentUser, getUsers, getUserById } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticate, getCurrentUser);
router.put('/me', authenticate, updateCurrentUser);
router.get('/:id', authenticate, getUserById);

export default router;
