import {
  BaseWindow,
  EpHandler,
  EpMainWindow,
  EpSendToRenderer,
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
      this.test();
    }, 1000);
  }

  onInit() {
    this.initParams({
      url: "app://./html/index.html",
    });
  }

  /**
   * 给renderer发送数据
   */
  @EpSendToRenderer()
  async test() {
    return this.testService.test();
  }

  /**
   * 仅接受此窗口的事件
   */
  @EpHandler()
  async epTest() {
    return this.testService.test();
  }
}
