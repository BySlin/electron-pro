import { BaseWindow, EpWindow } from "electron-pro";
import { Autoload } from "@midwayjs/core";

@EpWindow()
@Autoload()
export class TestOpenParamsWindow extends BaseWindow {
  onInit() {
    this.initParams({
      url: "app://./html/testOpenParams.html",
    });
  }
}
