import { BaseWindow, EpWindow } from "electron-pro";
import { Autoload } from "@midwayjs/core";

@EpWindow()
@Autoload()
export class TestWindow extends BaseWindow {
  onInit() {
    this.initParams({
      url: "ep://./html/test.html",
    });
  }
}
