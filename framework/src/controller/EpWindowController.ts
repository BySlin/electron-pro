import { EpController, EpHandler } from '../decorator';
import {
  closeAllByWindowName,
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
  async closeWindow(webContentsId: number) {
    closeWindow(webContentsId);
  }

  @EpHandler()
  async closeAllByWindowName(windowName: string) {
    return await closeAllByWindowName(windowName);
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
