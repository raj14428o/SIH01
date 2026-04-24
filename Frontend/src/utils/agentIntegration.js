const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Download the platform agent from the backend.
 * @param {string} platform - Platform slug ('windows', 'linux', or 'universal')
 * @returns {Promise<void>}
 */
export const downloadAgentFromServer = async (platform) => {
  const response = await fetch(`${API_BASE_URL}/api/agent/download/${platform}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to download ${platform} agent`);
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  const disposition = response.headers.get('content-disposition') || '';
  const filenameMatch = disposition.match(/filename="?([^";]+)"?/i);
  const downloadedFilename = filenameMatch?.[1] || `datawipe-agent-${platform}.zip`;

  link.href = objectUrl;
  link.download = downloadedFilename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
};

/**
 * Queue a wipe command for the local/shared agent.
 * @param {Object} command
 * @param {string} command.action
 * @param {string} [command.path]
 * @param {string} [command.disk]
 * @param {string} command.method
 * @param {string} command.platform
 * @returns {Promise<Object>}
 */
export const queueWipeCommand = async ({ action, path, disk, method, platform }) => {
  const payload = {
    method,
    platform,
  };

  if (path) payload.path = path;
  if (disk) payload.disk = disk;

  const response = await fetch(`${API_BASE_URL}/api/agent/commands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agentId: 'default',
      action,
      payload,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to queue wipe command');
  }

  return data;
};

export const fetchCommandStatus = async (commandId) => {
  const response = await fetch(`${API_BASE_URL}/api/agent/commands/${commandId}/status`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to fetch command status');
  }

  return data.command;
};

export const waitForCommandCompletion = async (commandId, options = {}) => {
  const timeoutMs = options.timeoutMs ?? 180000;
  const pollIntervalMs = options.pollIntervalMs ?? 1500;
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const status = await fetchCommandStatus(commandId);
    if (status.status === 'success' || status.phase === 'completed') {
      return status;
    }

    if (status.status === 'failed' || status.phase === 'failed') {
      throw new Error(status.details?.message || 'Wipe command failed on agent');
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error('Timed out waiting for wipe completion confirmation');
};

// Export all functions as a single object for easier importing
export default {
  downloadAgentFromServer,
  queueWipeCommand,
  fetchCommandStatus,
  waitForCommandCompletion
};
