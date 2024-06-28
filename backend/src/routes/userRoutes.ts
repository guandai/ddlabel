import { Router } from 'express';
import { registerUser, loginUser, editUser, getCurrentUser, getUsers } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/:id', editUser);
router.get('/me', authenticate, getCurrentUser);
router.get('/', authenticate, getUsers); // Add this line to fetch all users

export default router;
