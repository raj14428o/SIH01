const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // This line is crucial for connecting the frontend and backend
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// This is the core logic
ipcMain.on('delete-file', (event, filePath) => {
  // Show a confirmation box before deleting
  const options = {
    type: 'question',
    buttons: ['Cancel', 'Yes, delete'],
    defaultId: 1,
    title: 'Confirm Deletion',
    message: `Are you sure you want to permanently delete this?\n\n${filePath}`,
  };

  dialog.showMessageBox(null, options).then(response => {
    // The user clicked "Yes, delete"
    if (response.response === 1) {
      // Use fs.rm to delete the file or folder
      fs.rm(filePath, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
          event.sender.send('deletion-error', err.message);
        } else {
          console.log(`Successfully deleted: ${filePath}`);
          event.sender.send('deletion-success', `Successfully deleted: ${filePath}`);
        }
      });
    }
  });
});