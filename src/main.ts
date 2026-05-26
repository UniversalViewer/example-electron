import { app, BrowserWindow } from 'electron';
import path from 'path';

function createWindow(): void {
  const userArgs = process.argv.slice(2);
  const manifestFlag = userArgs.find((arg) => arg.startsWith('--manifest='));
  const manifestUrl = manifestFlag
    ? manifestFlag.slice('--manifest='.length)
    : userArgs.length > 0
    ? userArgs[0]
    : 'https://wellcomelibrary.org/iiif/b18035723/manifest';

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      sandbox: false
    }
  });

  win.loadFile(path.join(__dirname, '../index.html'), {
    query: {
      manifest: manifestUrl
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
