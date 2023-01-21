import { EPService } from "electron-pro";

export class TestService extends EPService {
  test() {
    console.log("Hello Electron-Pro");
  }
}
