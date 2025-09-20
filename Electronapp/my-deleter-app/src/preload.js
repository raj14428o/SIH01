const { contextBridge, ipcRenderer } = require('electron');

// Expose a secure API to the user interface
contextBridge.exposeInMainWorld('electronAPI', {
  deleteFile: (filePath) => ipcRenderer.send('delete-file', filePath),
  onDeletionSuccess: (callback) => ipcRenderer.on('deletion-success', (_event, value) => callback(value)),
  onDeletionError: (callback) => ipcRenderer.on('deletion-error', (_event, value) => callback(value))
});