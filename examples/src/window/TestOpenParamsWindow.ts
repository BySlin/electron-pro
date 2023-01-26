import { BaseMultiWindow, EpMultiWindow } from "electron-pro";
import { Autoload } from "@midwayjs/core";

@EpMultiWindow()
@Autoload()
export class TestOpenParamsWindow extends BaseMultiWindow {
  onInit() {
    this.initParams({
      url: "app://./html/testOpenParams.html",
    });
  }
}
