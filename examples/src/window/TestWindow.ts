import { BaseWindow, EpWindow } from "electron-pro";
import { Autoload } from "@midwayjs/core";

@EpWindow()
@Autoload()
export class TestWindow extends BaseWindow {
  onCreate() {
    this.initParams({
      url: "app://./html/test.html",
      multiWindow: true,
    });
    return super.onCreate();
  }
}
