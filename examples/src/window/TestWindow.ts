import { BaseWindow, EpWindow } from "electron-pro";
import { Autoload } from "@midwayjs/core";

@EpWindow()
@Autoload()
export class TestWindow extends BaseWindow {
  onBeforeCreate() {
    this.initParams({
      url: "app://./html/test.html",
    });
  }
}
