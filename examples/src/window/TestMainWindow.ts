import { createWindow, EpWindow } from "electron-pro";
import { Inject, Autoload, Init } from "@midwayjs/core";
import { TestService } from "../services/TestService";

@EpWindow()
@Autoload()
export class TestMainWindow {
  @Inject()
  testService: TestService;

  @Init()
  async init() {
    createWindow("app://./html/index.html");
  }

  async test() {
    return this.testService.test();
  }
}
