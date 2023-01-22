import { EpController } from "electron-pro";
import { Inject } from "@midwayjs/core";
import { TestService } from "../services/TestService";

@EpController()
export class TestMainWindow {
  @Inject()
  testService: TestService;

  async test() {
    return this.testService.test();
  }
}
