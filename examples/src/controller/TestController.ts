import { EpController, EpHandler } from "electron-pro";
import { Inject } from "@midwayjs/core";
import { TestService } from "../services";

@EpController()
export class TestController {
  @Inject()
  testService: TestService;

  @EpHandler()
  async test() {
    return this.testService.test();
  }
}
