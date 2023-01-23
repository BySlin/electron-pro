import { BaseWindow, EpMainWindow, EpSendRenderer } from "electron-pro";
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
      this.test();
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
