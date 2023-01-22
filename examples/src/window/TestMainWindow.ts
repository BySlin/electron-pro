import { createWindow, EpSendRenderer, EpWindow } from "electron-pro";
import { Autoload, Init, Inject } from "@midwayjs/core";
import { TestService } from "../services/TestService";
import { BrowserWindow } from "electron";

@EpWindow()
@Autoload()
export class TestMainWindow {
  @Inject()
  testService: TestService;

  currentWindow: BrowserWindow;

  @Init()
  async init() {
    this.currentWindow = createWindow("app://./html/index.html");

    setInterval(() => {
      this.test();
    }, 1000);
  }

  @EpSendRenderer({
    windowPropertyName: "currentWindow",
  })
  async test() {
    return this.testService.test();
  }
}
