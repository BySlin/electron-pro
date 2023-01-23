import {
  BaseWindow,
  EpMainWindow,
  EpSendRenderer,
  showWindow,
} from "electron-pro";
import { Autoload, Init, Inject } from "@midwayjs/core";
import { TestService } from "../services/TestService";

@EpMainWindow()
@Autoload()
export class TestMainWindow extends BaseWindow {
  @Inject()
  testService: TestService;

  @Init()
  async init() {
    setInterval(() => {
      showWindow(this.getCurrentWindow().webContents.id);
    }, 1000);
  }

  onInit() {
    this.initParams({
      url: "app://./html/index.html",
    });
  }

  @EpSendRenderer()
  async test() {
    return this.testService.test();
  }
}
