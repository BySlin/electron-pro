import { EpController, EpHandler, EpInject } from "electron-pro";
import { TestService } from "../services";

@EpController()
export class TestController {
  @EpInject()
  testService: TestService;

  @EpHandler()
  async test() {
    return this.testService.test();
  }
}
