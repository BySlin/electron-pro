import { EpController, EpHandler } from '../decorator';
import {
  closeMultiByName,
  closeWindow,
  openWindow,
  showWindow,
  hideWindow,
  getMultiIdsByName,
} from '../utils';

@EpController()
export class EpWindowController {
  @EpHandler()
  async open(
    windowName: string,
    openParams?: Record<string, any>,
  ): Promise<number> {
    return await openWindow(windowName, openParams);
  }

  @EpHandler()
  async close(id: number) {
    this.checkWindowId(id);
    closeWindow(id);
  }

  @EpHandler()
  async closeMultiByName(windowName: string): Promise<number[]> {
    return [...closeMultiByName(windowName)];
  }

  @EpHandler()
  async getMultiIdsByName(windowName: string): Promise<number[]> {
    return [...getMultiIdsByName(windowName)];
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

  @EpHandler()
  async sendByName(windowName: string) {}

  @EpHandler()
  async sendById(id: string) {}

  @EpHandler()
  async sendMultiByName(windowName: string) {}

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
