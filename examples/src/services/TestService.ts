import { EpService } from "electron-pro";

@EpService()
export class TestService {
  count = 0;

  test() {
    return `Hello Electron-Pro ${this.count++}`;
  }
}
