import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/* --- Public Routes --- */
router.post('/register', registerUser);
router.post('/login', loginUser);

/* --- Protected Routes --- */
router.post('/logout', logoutUser);

export default router;