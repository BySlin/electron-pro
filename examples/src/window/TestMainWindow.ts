import { createWindow, EpWindow } from "electron-pro";
import { Inject, Autoload, Init } from "@midwayjs/core";
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
  }

  async test() {
    return this.testService.test();
  }
}
