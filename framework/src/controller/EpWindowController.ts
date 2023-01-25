import { BrowserWindow, IpcMainInvokeEvent } from 'electron';
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
    _,
    windowName: string,
    openParams?: Record<string, any>,
  ): Promise<number> {
    return await openWindow(windowName, openParams);
  }

  @EpHandler()
  async close(e: IpcMainInvokeEvent) {
    BrowserWindow.fromWebContents(e.sender)?.close();
  }

  @EpHandler()
  async closeById(_, id: number) {
    this.checkWindowId(id);
    closeWindow(id);
  }

  @EpHandler()
  async closeMultiByName(_, windowName: string): Promise<number[]> {
    return [...closeMultiByName(windowName)];
  }

  @EpHandler()
  async getMultiIdsByName(_, windowName: string): Promise<number[]> {
    return [...getMultiIdsByName(windowName)];
  }

  @EpHandler()
  async showWindow(_, id: number) {
    this.checkWindowId(id);
    showWindow(id);
  }

  @EpHandler()
  async hideWindow(_, id: number) {
    this.checkWindowId(id);
    hideWindow(id);
  }

  @EpHandler()
  async sendByName(_, windowName: string) {}

  @EpHandler()
  async sendById(_, id: string) {}

  @EpHandler()
  async sendMultiByName(_, windowName: string) {}

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
