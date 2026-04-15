import express from 'express';
import {
  downloadAgent,
  enqueueCommand,
  pollNextCommand,
  updateAgentStatus,
  listAgentStatus,
} from '../Controllers/agentController.js';

const router = express.Router();

router.get('/download/:platform', downloadAgent);
router.post('/commands', enqueueCommand);
router.get('/commands/next', pollNextCommand);
router.post('/status', updateAgentStatus);
router.get('/status', listAgentStatus);

export default router;
