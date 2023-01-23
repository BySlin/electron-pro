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

  onCreate() {
    this.setUrl("app://./html/index.html");
    super.onCreate();
  }

  @EpSendRenderer({
    windowPropertyName: "currentWindow",
  })
  async test() {
    return this.testService.test();
  }
}
