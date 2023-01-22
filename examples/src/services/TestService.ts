import { EpService } from "electron-pro";

@EpService()
export class TestService {
  test() {
    return "Hello Electron-Pro";
  }
}
