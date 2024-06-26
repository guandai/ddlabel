import { Router } from 'express';
import { registerUser, loginUser, updateUserById, getUsers, getUserById, deleteUserById } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/:id', authenticate, updateUserById);
router.get('/:id', authenticate, getUserById);
router.delete('/:id', authenticate, deleteUserById);

export default router;
