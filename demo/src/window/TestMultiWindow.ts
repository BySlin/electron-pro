import { BaseMultiWindow, EpMultiWindow } from "electron-pro";
import { Autoload } from "@midwayjs/core";

@EpMultiWindow()
@Autoload()
export class TestMultiWindow extends BaseMultiWindow {
  onInit() {
    this.initParams({
      url: "ep://./html/testMulti.html",
    });
  }

  onCreate() {
    super.onCreate();
    this.currentWindow?.webContents.openDevTools();
  }
}
