const {
  dialog,
  app,
  ipcMain,
  BrowserWindow,
  Tray,
  Menu,
  shell,
} = require('electron');
const contextMenu = require('electron-context-menu');

process.on('uncaughtException', (error) => {
  // Perform any necessary cleanup tasks here
  dialog.showErrorBox('An error occurred', error.stack);

  // Exit the app
  process.exit(1);
});

const path = require('path');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
let win = null;
let closeToTray = false;
let winTray = null;
let trayExists = false;
const instanceLock = app.requestSingleInstanceLock();

if (require('electron-squirrel-startup')) app.quit();

const PORT = isDev ? '5173' : '51736';

contextMenu({
  prepend: (defaultActions, parameters, browserWindow) => [],
});

function handleSetCloseToTray(event, setting) {
  closeToTray = setting;

  if (process.platform !== 'darwin') {
    if (closeToTray && trayExists) {
      winTray.destroy();
      trayExists = false;
    }

    if (closeToTray && !trayExists) {
      createTray(win);
      trayExists = true;
    }
  }
}

function createWindow() {
  let iconPath = '';
  if (isDev) {
    iconPath = path.join(__dirname, '../public/icon-rounded.png');
  } else {
    iconPath = path.join(__dirname, '../dist/icon-rounded.png');
  }
  autoUpdater.checkForUpdatesAndNotify();

  win = new BrowserWindow({
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      spellcheck: true,
    },
  });

  win.maximize();
  win.show();

  isDev || createServer();

  win.loadURL(`http://localhost:${PORT}`);

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  win.on('close', function (event) {
    if (closeToTray && !app.isQuiting) {
      event.preventDefault();
      win.hide();
    }
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    // Open the url in an external browser.
    shell.openExternal(url);

    // Return an object indicating that the window opening request has been handled.
    return { action: 'deny' };
  });

  return win;
}

const createTray = (window) => {
  winTray = Tray(
    path.join(
      __dirname,
      isDev ? '../public/icon-rounded.png' : '../dist/icon-rounded.png'
    )
  );
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        if (win) {
          if (!win.isVisible()) win.show();

          if (win.isMinimized()) win.restore();

          win.focus();
        }
      },
    },
    {
      label: 'Exit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  winTray.on('click', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      if (!win.isVisible()) win.show();
      win.focus();
    }
  });
  winTray.setToolTip('OmniLink');
  winTray.setContextMenu(contextMenu);

  return winTray;
};

app.on('activate', () => {
  if (win) {
    win.show();
  }
});

app.on('window-all-closed', () => {
  if (!(process.platform === 'darwin' && closeToTray)) {
    app.quit();
  }
});

if (!instanceLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      if (!win.isVisible()) win.show();

      if (win.isMinimized()) win.restore();

      win.focus();
    }
  });

  app.whenReady().then(() => {
    ipcMain.on('set-close-to-tray', handleSetCloseToTray);

    win = createWindow();
  });
}

const createServer = () => {
  // Dependencies
  const http = require('http');
  const fs = require('fs');
  const path = require('path');

  // MIME types for different file extensions
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.wasm': 'application/wasm',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
  };

  // Create a http server
  const server = http.createServer((request, response) => {
    // Get the file path from the URL
    let filePath =
      request.url === '/'
        ? `${path.join(__dirname, '../dist/index.html')}`
        : `${path.join(__dirname, `../dist/${request.url}`)}`;

    // Get the file extension from the filePath
    let extname = path.extname(filePath);

    // Set the default MIME type to text/plain
    let contentType = 'text/plain';

    // Check if the file extension is in the MIME types object
    if (extname in mimeTypes) {
      contentType = mimeTypes[extname];
    }

    // Read the file from the disk
    fs.readFile(filePath, (error, content) => {
      if (error) {
        // If file read error occurs
        if (error.code === 'ENOENT') {
          // File not found error
          response.writeHead(404);
          response.end('File Not Found');
        } else {
          // Server error
          response.writeHead(500);
          response.end(`Server Error: ${error.code}`);
        }
      } else {
        // File read successful
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
      }
    });
  });

  // Listen for request on port ${PORT}
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}/`);
  });
};
