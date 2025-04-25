const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');
const isDev = process.env.NODE_ENV === 'development';

let viteProcess = null;
let mainWindow = null;

function killProcessTree(pid) {
  return new Promise((resolve, reject) => {
    if (process.platform === 'win32') {
      exec(`taskkill /pid ${pid} /T /F`, (error) => {
        if (error) {
          console.error('Error killing process tree:', error);
          reject(error);
        } else {
          resolve();
        }
      });
    } else {
      exec(`pkill -P ${pid}`, (error) => {
        if (error) {
          console.error('Error killing process tree:', error);
          reject(error);
        } else {
          resolve();
        }
      });
    }
  });
}

function startViteServer() {
  return new Promise((resolve, reject) => {
    if (isDev) {
      // Use a shell to run the Vite server
      const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
      viteProcess = spawn(command, ['vite', 'dev'], {
        shell: true,
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'development' }
      });

      viteProcess.on('error', (error) => {
        console.error('Failed to start Vite server:', error);
        reject(error);
      });

      // Wait for the server to be ready
      setTimeout(resolve, 2000);
    } else {
      resolve();
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // In development, load from the Vite dev server
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function initialize() {
  try {
    await startViteServer();
    createWindow();
  } catch (error) {
    console.error('Failed to initialize:', error);
    app.quit();
  }
}

async function cleanup() {
  if (viteProcess) {
    console.log('Killing Vite process tree...');
    try {
      // Kill the entire process tree
      await killProcessTree(viteProcess.pid);
      console.log('Process tree killed successfully');
    } catch (error) {
      console.error('Error killing process tree:', error);
      // Fallback to direct process kill
      try {
        viteProcess.kill('SIGKILL');
      } catch (killError) {
        console.error('Error killing process directly:', killError);
      }
    }
    viteProcess = null;
  }
}

// Handle app quit
app.on('quit', async () => {
  console.log('App quitting...');
  await cleanup();
});

app.whenReady().then(initialize);

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', async function () {
  if (process.platform !== 'darwin') {
    await cleanup();
    app.quit();
  }
});

app.on('before-quit', async () => {
  await cleanup();
});

// Handle process termination
process.on('SIGINT', async () => {
  console.log('SIGINT received...');
  await cleanup();
  app.quit();
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received...');
  await cleanup();
  app.quit();
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('Uncaught exception:', error);
  await cleanup();
  app.quit();
});

// Handle unhandled rejections
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled rejection:', reason);
  await cleanup();
  app.quit();
}); 