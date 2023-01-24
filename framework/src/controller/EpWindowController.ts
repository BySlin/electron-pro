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
  async openWindow(windowName: string): Promise<number> {
    return await openWindow(windowName);
  }

  @EpHandler()
  async closeWindow(id: number) {
    this.checkWindowId(id);
    closeWindow(id);
  }

  @EpHandler()
  async closeAllByWindowName(windowName: string): Promise<number[]> {
    return await closeAllByWindowName(windowName);
  }

  @EpHandler()
  async showWindow(id: number) {
    showWindow(id);
  }

  @EpHandler()
  async hideWindow(id: number) {
    hideWindow(id);
  }

  /**
   * 校验窗口id
   * @param id 窗口id
   * @private
   */
  private checkWindowId(id: number) {
    if (id == undefined) {
      throw new Error('窗口id不能为空');
    }
  }
}
