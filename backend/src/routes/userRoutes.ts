import { Router } from 'express';
import { registerUser, loginUser, editUser, getCurrentUser } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/:id', editUser);
router.get('/me', authenticate, getCurrentUser);

export default router;
