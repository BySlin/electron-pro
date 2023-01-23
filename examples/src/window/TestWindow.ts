import { BaseWindow, EpWindow } from "electron-pro";
import { Autoload } from "@midwayjs/core";

@EpWindow()
@Autoload()
export class TestWindow extends BaseWindow {
  onCreate() {
    this.setUrl("app://./html/test.html");
    super.onCreate();
  }
}
