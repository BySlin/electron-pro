import { EpController, EpHandler } from '../decorator';
import { closeAllWindow, closeWindow, openWindow } from '../utils';

@EpController()
export class EpWindowController {
  @EpHandler()
  async openWindow(windowName: string) {
    await openWindow(windowName);
  }

  @EpHandler()
  async closeWindow(windowName: string, webContentsId?: number) {
    await closeWindow(windowName, webContentsId);
  }

  @EpHandler()
  async closeAllWindow(windowName: string) {
    await closeAllWindow(windowName);
  }
}
