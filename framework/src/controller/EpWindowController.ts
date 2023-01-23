import { EpController, EpHandler } from '../decorator';
import {
  closeAllWindow,
  closeWindow,
  openWindow,
  showWindow,
  hideWindow,
} from '../utils';

@EpController()
export class EpWindowController {
  @EpHandler()
  async openWindow(windowName: string) {
    return await openWindow(windowName);
  }

  @EpHandler()
  async closeWindow(windowName: string, webContentsId?: number) {
    await closeWindow(windowName, webContentsId);
  }

  @EpHandler()
  async closeAllWindow(windowName: string) {
    await closeAllWindow(windowName);
  }

  @EpHandler()
  async showWindow(webContentsId: number) {
    showWindow(webContentsId);
  }

  @EpHandler()
  async hideWindow(webContentsId: number) {
    hideWindow(webContentsId);
  }
}
