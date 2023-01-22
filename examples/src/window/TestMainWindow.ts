import {
  createWindow,
  EpSendRenderer,
  EpWindow,
  EpCurrentWindow,
} from "electron-pro";
import { Inject, Autoload, Init } from "@midwayjs/core";
import { TestService } from "../services/TestService";
import { BrowserWindow } from "electron";

@EpWindow()
@Autoload()
export class TestMainWindow {
  @Inject()
  testService: TestService;

  @EpCurrentWindow()
  currentWindow: BrowserWindow;

  @Init()
  async init() {
    this.currentWindow = createWindow("app://./html/index.html");

    setInterval(() => {
      this.test();
    }, 5000);
  }

  @EpSendRenderer()
  async test() {
    return this.testService.test();
  }
}
