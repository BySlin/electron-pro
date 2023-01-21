import { IPCController, IPCHandler, Inject } from "electron-pro";
import { TestService } from "../services/TestService";

export class TestController extends IPCController {
  @Inject(TestService)
  testService!: TestService;

  @IPCHandler()
  async test() {
    return this.testService.test();
  }
}
