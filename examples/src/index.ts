import { App, isDevelopment, PRELOAD_JS_PATH } from "electron-pro";

import { BrowserWindow } from "electron";
import { TestController } from "./controller";
import { TestService } from "./services";

const mainApp = new App();

mainApp.registerController(TestController);
mainApp.registerService(TestService);
mainApp.bootstrap().then(() => {
  createWindow();
});

let mainWindow: BrowserWindow;
function createWindow() {
  console.log(PRELOAD_JS_PATH);
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: PRELOAD_JS_PATH,
    },
  });
  if (isDevelopment) {
    mainWindow.loadURL("app://../../html/index.html");
  } else {
    mainWindow.loadURL("app://./index.html");
  }
}
