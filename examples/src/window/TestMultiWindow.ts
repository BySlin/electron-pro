import { BaseWindow, EpWindow } from "electron-pro";
import { Autoload } from "@midwayjs/core";

@EpWindow()
@Autoload()
export class TestMultiWindow extends BaseWindow {
  onCreate() {
    this.initParams({
      url: "app://./html/testMulti.html",
      multiWindow: true,
    });
    return super.onCreate();
  }
}
