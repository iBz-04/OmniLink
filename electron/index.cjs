/* eslint-disable @typescript-eslint/no-var-requires */
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
  dialog.showErrorBox('An error occurred', error.stack);
 
  process.exit(1);
});

const path = require('path');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
let win = null;
let closeToTray = false;
let winTray = null;
let trayExists = false;
let isQuiting = false;
const instanceLock = app.requestSingleInstanceLock();

if (require('electron-squirrel-startup')) app.quit();


function getArgValue(argName) {
  const args = process.argv.slice(1); 
  const arg = args.find(a => a.startsWith(`${argName}=`));
  return arg ? arg.split('=')[1] : null;
}

const devUrl = getArgValue('--url'); 
const prodPath = path.join(__dirname, '../dist/index.html'); 

contextMenu({
  prepend: (_defaultActions, _parameters, _browserWindow) => [],
});

function handleSetCloseToTray(event, value) {
  closeToTray = value;

  if (process.platform !== 'darwin') {
    if (closeToTray && trayExists) {
      winTray.destroy();
      trayExists = false;
    }

    if (closeToTray && !trayExists) {
      createTray();
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
    icon: iconPath,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      spellcheck: true,
    },
  });

  win.maximize();
  win.show();

 
  if (isDev) {
    const loadUrl = devUrl || 'http://localhost:5173'; 
    win.loadURL(loadUrl).catch(err => {
      console.error('Failed to load dev URL:', loadUrl, err);
      
    });
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(prodPath).catch(err => {
      console.error('Failed to load production file:', prodPath, err);
      
    });
    
  }

  win.on('close', function (event) {
    if (closeToTray && !isQuiting) {
      event.preventDefault();
      win.hide();
    }
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);

  
    return { action: 'deny' };
  });

  return win;
}

const createTray = () => {
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
  app.on('second-instance', (_event, _commandLine, _workingDirectory) => {
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
