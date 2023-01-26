import { BaseWindow, EpMultiWindow } from "electron-pro";
import { Autoload } from "@midwayjs/core";

@EpMultiWindow()
@Autoload()
export class TestOpenParamsWindow extends BaseWindow {
  onInit() {
    this.initParams({
      url: "app://./html/testOpenParams.html",
    });
  }
}
