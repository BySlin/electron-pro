import { EpController, EpHandler } from '../decorator';
import {
  closeAllByWindowName,
  closeWindow,
  openWindow,
  showWindow,
  hideWindow,
  getWindowIdsByWindowName,
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
    return [...closeAllByWindowName(windowName)];
  }

  @EpHandler()
  async getWindowIdsByWindowName(windowName: string): Promise<number[]> {
    return [...getWindowIdsByWindowName(windowName)];
  }

  @EpHandler()
  async showWindow(id: number) {
    this.checkWindowId(id);
    showWindow(id);
  }

  @EpHandler()
  async hideWindow(id: number) {
    this.checkWindowId(id);
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
