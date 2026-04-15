import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const agentScriptPath = path.join(repoRoot, 'agent', 'agent.py');

const commandQueues = new Map();
const agentStatus = new Map();

const ensureQueue = (agentId) => {
  if (!commandQueues.has(agentId)) {
    commandQueues.set(agentId, []);
  }
  return commandQueues.get(agentId);
};

export const downloadAgent = async (req, res, next) => {
  try {
    const platform = String(req.params.platform || '').toLowerCase();
    const supportedPlatforms = new Set(['windows', 'linux']);

    if (!supportedPlatforms.has(platform)) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported platform. Use windows or linux.',
      });
    }

    const filename = `datawipe-agent-${platform}.py`;
    return res.download(agentScriptPath, filename);
  } catch (error) {
    return next(error);
  }
};

export const enqueueCommand = (req, res) => {
  const { agentId, action, payload = {} } = req.body;

  if (!agentId || !action) {
    return res.status(400).json({
      success: false,
      message: 'agentId and action are required.',
    });
  }

  const command = {
    commandId: crypto.randomUUID(),
    action,
    ...payload,
    createdAt: new Date().toISOString(),
  };

  const queue = ensureQueue(agentId);
  queue.push(command);

  return res.status(202).json({
    success: true,
    message: 'Command queued.',
    command,
    pendingCount: queue.length,
  });
};

export const pollNextCommand = (req, res) => {
  const agentId = req.query.agentId || req.headers['x-agent-id'];

  if (!agentId) {
    return res.status(400).json({
      success: false,
      message: 'agentId is required as query parameter or x-agent-id header.',
    });
  }

  const queue = ensureQueue(agentId);
  const nextCommand = queue.shift() || null;

  return res.status(200).json({
    success: true,
    command: nextCommand,
    pendingCount: queue.length,
  });
};

export const updateAgentStatus = (req, res) => {
  const { agentId, status = 'online', lastCommandId = null, details = null } = req.body;

  if (!agentId) {
    return res.status(400).json({
      success: false,
      message: 'agentId is required.',
    });
  }

  const existing = agentStatus.get(agentId);
  const snapshot = {
    agentId,
    status,
    lastCommandId: lastCommandId ?? existing?.lastCommandId ?? null,
    details: details ?? existing?.details ?? null,
    updatedAt: new Date().toISOString(),
  };

  agentStatus.set(agentId, snapshot);

  return res.status(200).json({
    success: true,
    agent: snapshot,
  });
};

export const listAgentStatus = (_req, res) => {
  return res.status(200).json({
    success: true,
    agents: Array.from(agentStatus.values()),
  });
};
