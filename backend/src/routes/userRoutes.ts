import { Router } from 'express';
import { registerUser, loginUser, updateUser, getCurrentUser, getUsers } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getUsers); // Add this line to fetch all users
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticate, getCurrentUser);
router.put('/:id', updateUser);

export default router;
