
import express from 'express';
// Corrected the import path to use all lowercase 'controllers'
import { requestWipeSignature } from '../controllers/wipeController.js';
// Corrected the import path to use all lowercase 'middleware'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/request-signature', protect, requestWipeSignature);

export default router;

