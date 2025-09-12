// --- Wipe API Routes (ES Module Version) ---
// Location: Bhagalpur, Bihar
// Timestamp: Thursday, 11 September 2025, 11:58 PM IST

import express from 'express';
// Corrected the import path to use all lowercase 'controllers'
import { requestWipeSignature } from '../controllers/wipeController.js';
// Corrected the import path to use all lowercase 'middleware'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route is the single point of entry for the desktop application to request a digital signature for a wipe event.
// 1. It's a POST request because the client is sending data to the server to be processed.
// 2. It's protected by the 'protect' middleware. This means the desktop app must first log the user in
//    and then include the user's valid JWT in the Authorization header of this request (e.g., "Authorization: Bearer <token>").
// 3. If the token is valid, the request is passed to the `requestWipeSignature` controller function to be handled.
router.post('/request-signature', protect, requestWipeSignature);

export default router;

