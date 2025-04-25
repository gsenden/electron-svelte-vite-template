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
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, NODE_ENV: 'development' }
      });

      // Handle Vite output
      viteProcess.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
          console.log('\x1b[36m%s\x1b[0m', output); // Cyan color for Vite output
        }
      });

      viteProcess.stderr.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
          console.error('\x1b[31m%s\x1b[0m', output); // Red color for errors
        }
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
    console.log('\x1b[33m%s\x1b[0m', 'Killing Vite process tree...'); // Yellow color for cleanup message
    try {
      // Kill the entire process tree
      await killProcessTree(viteProcess.pid);
      console.log('\x1b[32m%s\x1b[0m', 'Process tree killed successfully'); // Green color for success
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', 'Error killing process tree:', error); // Red color for errors
      // Fallback to direct process kill
      try {
        viteProcess.kill('SIGKILL');
      } catch (killError) {
        console.error('\x1b[31m%s\x1b[0m', 'Error killing process directly:', killError); // Red color for errors
      }
    }
    viteProcess = null;
  }
}

// Handle app quit
app.on('quit', async () => {
  console.log('\x1b[33m%s\x1b[0m', 'App quitting...'); // Yellow color for quit message
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
  console.log('\x1b[33m%s\x1b[0m', 'SIGINT received...'); // Yellow color for signal message
  await cleanup();
  app.quit();
});

process.on('SIGTERM', async () => {
  console.log('\x1b[33m%s\x1b[0m', 'SIGTERM received...'); // Yellow color for signal message
  await cleanup();
  app.quit();
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('\x1b[31m%s\x1b[0m', 'Uncaught exception:', error); // Red color for errors
  await cleanup();
  app.quit();
});

// Handle unhandled rejections
process.on('unhandledRejection', async (reason, promise) => {
  console.error('\x1b[31m%s\x1b[0m', 'Unhandled rejection:', reason); // Red color for errors
  await cleanup();
  app.quit();
}); 