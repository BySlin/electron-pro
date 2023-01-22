import { EPService } from "electron-pro";

export class TestService extends EPService {
  test() {
    return "Hello Electron-Pro";
  }
}
