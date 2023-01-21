import { App } from "electron-pro";

import { BrowserWindow } from "electron";
import * as path from "path";

const mainApp = new App();

mainApp.bootstrap().then(() => {
  createWindow();
});
const isDevelopment = process.env.NODE_ENV === "development";
let mainWindow: BrowserWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "..", "preload", "index.js"),
    },
  });
  if (isDevelopment) {
    mainWindow.loadURL("app://../../html/index.html");
  } else {
    mainWindow.loadURL("app://./index.html");
  }
}
