/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import { EditFileArgs } from '@/src/main/preload';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const sharp = require('sharp');

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 550,
    height: 375,
    resizable: false,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open external URLs in a browser, not the app
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

async function handleOpenFile(): Promise<string | undefined> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [
      {
        name: 'Images',
        extensions: [
          'jpg',
          'jpeg',
          'png',
          'avif',
          'webp',
          'gif',
          'tiff',
          'svg',
        ],
      },
    ],
  });
  if (!canceled) {
    return filePaths[0];
  }
  return undefined;
}

async function handleEditFile({
  filePath,
  fileFormat,
  quality = 100,
}: EditFileArgs) {
  const outputPath = `${filePath.substring(
    0,
    filePath.lastIndexOf('.'),
  )}.${fileFormat}`;

  // raw files cannot be converted with toFormat(), handle separately here
  if (fileFormat === 'raw') {
    sharp(filePath)
      .raw({ quality })
      .toFile(outputPath)
      .catch((error: unknown) => {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          console.log(error);
        }
      });
  } else {
    sharp(filePath)
      .toFormat(fileFormat, { quality })
      .toFile(outputPath)
      .catch((error: unknown) => {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          console.log(error);
        }
      });
  }
}

app.on('window-all-closed', () => {
  // Do not quit the app on macOS when closing window -- convention
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    ipcMain.handle('dialog:openFile', handleOpenFile);
    ipcMain.on('editFile', async (event, args) => {
      event.returnValue = await handleEditFile(args);
    });
    createWindow();
    app.on('activate', () => {
      // On macOS, it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
