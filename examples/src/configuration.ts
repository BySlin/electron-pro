import * as ep from "electron-pro";
import { isDevelopment, PRELOAD_JS_PATH } from "electron-pro";
import { join } from "path";
import { BrowserWindow } from "electron";
import { Configuration, ILifeCycle } from "@midwayjs/core";

@Configuration({
  imports: [ep],
  importConfigs: [join(__dirname, "./config")],
})
export class ContainerLifeCycle implements ILifeCycle {
  async onReady() {
    console.log("启动完成");
    createWindow();
  }
}

let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: PRELOAD_JS_PATH,
    },
  });
  if (isDevelopment) {
    mainWindow.loadURL("app://./html/index.html");
  } else {
    mainWindow.loadURL("app://./html/index.html");
  }
}
