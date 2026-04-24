import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import fs from 'fs';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const agentRootPath = path.join(repoRoot, 'agent');

const commandQueues = new Map();
const agentStatus = new Map();
const commandStatus = new Map();

const ensureQueue = (agentId) => {
  if (!commandQueues.has(agentId)) {
    commandQueues.set(agentId, []);
  }
  return commandQueues.get(agentId);
};

export const downloadAgent = async (req, res, next) => {
  try {
    const platform = String(req.params.platform || '').toLowerCase();
    const supportedPlatforms = new Set(['windows', 'linux', 'universal']);

    if (!supportedPlatforms.has(platform)) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported platform. Use windows, linux, or universal.',
      });
    }

    if (!fs.existsSync(agentRootPath)) {
      return res.status(500).json({
        success: false,
        message: 'Agent source folder not found on server.',
      });
    }

    const filename = platform === 'universal'
      ? 'datawipe-agent-universal.zip'
      : `datawipe-agent-${platform}.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (error) => {
      throw error;
    });

    archive.pipe(res);
    archive.directory(agentRootPath, 'agent');
    archive.append(
      `DataWipe Agent (${platform})\n\n` +
      `1. Extract this zip.\n` +
      `2. Open terminal in the extracted agent folder.\n` +
      `3. Set DATAWIPE_SERVER_URL to your hosted API root (example: https://your-domain.com).\n` +
      `4. Optional: set DATAWIPE_AGENT_ID to a stable unique value.\n` +
      `5. Run: python agent.py\n\n` +
      `This is a cross-platform agent bundle. It auto-runs commands for the host OS only.\n\n` +
      `Deletion checklist:\n` +
      `- Use absolute local path for file/folder wipe.\n` +
      `- Use drive/device id for disk erase (Windows: D:, Linux: /dev/sdb).\n` +
      `- Windows disk erase requires Administrator. Linux disk erase requires root.\n` +
      `- System/root disk erase is blocked by default for compliance.\n\n` +
      `Optional environment variables:\n` +
      `- DATAWIPE_SERVER_URL (default: http://localhost:5000)\n` +
      `- DATAWIPE_AGENT_ID (default: machine hostname)\n` +
      `- DATAWIPE_POLL_INTERVAL (default: 5)\n`,
      { name: 'agent/README_DOWNLOAD.txt' }
    );

    await archive.finalize();
    return undefined;
  } catch (error) {
    return next(error);
  }
};

export const enqueueCommand = (req, res) => {
  const { agentId = 'default', action, payload = {} } = req.body;

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

  commandStatus.set(command.commandId, {
    commandId: command.commandId,
    agentId,
    action,
    status: 'queued',
    phase: 'queued',
    details: null,
    updatedAt: new Date().toISOString(),
  });

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

  if (lastCommandId) {
    const phase = details?.phase || null;
    const normalizedStatus = status === 'online' && phase === 'completed'
      ? 'success'
      : status === 'error'
        ? 'failed'
        : status;

    commandStatus.set(lastCommandId, {
      commandId: lastCommandId,
      agentId,
      action: details?.action || details?.result?.action || null,
      status: normalizedStatus,
      phase: phase || normalizedStatus,
      details: details || null,
      updatedAt: new Date().toISOString(),
    });
  }

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

export const getCommandStatus = (req, res) => {
  const commandId = req.params.commandId;

  if (!commandId) {
    return res.status(400).json({
      success: false,
      message: 'commandId is required.',
    });
  }

  const status = commandStatus.get(commandId);
  if (!status) {
    return res.status(404).json({
      success: false,
      message: 'Command status not found.',
    });
  }

  return res.status(200).json({
    success: true,
    command: status,
  });
};
