import { EpService, EPService } from "electron-pro";

@EpService()
export class TestService extends EPService {
  test() {
    return "Hello Electron-Pro";
  }
}
