import { EpController, EpHandler } from '../decorator';
import { closeWindow, openWindow } from '../utils';

@EpController()
export class EpWindowController {
  @EpHandler()
  async openWindow(windowName: string) {
    openWindow(windowName);
  }

  @EpHandler()
  async closeWindow(windowName: string) {
    closeWindow(windowName);
  }
}
