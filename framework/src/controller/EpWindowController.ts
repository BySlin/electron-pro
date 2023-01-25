import { BrowserWindow, IpcMainInvokeEvent } from 'electron';
import { EpController, EpHandler } from '../decorator';
import {
  closeMultiByName,
  closeWindow,
  findMultiWindowModule,
  findWindowById,
  findWindowModuleById,
  getMultiIdsByName,
  getWindow,
  hideWindow,
  openWindow,
  showWindow,
} from '../utils';
import { EP_MESSAGE_EVENT_NAME } from '../constant';

@EpController()
export class EpWindowController {
  /**
   * 打开窗口
   * @param _
   * @param windowName 窗口名称
   * @param openParams 窗口启动参数
   * @return 窗口id
   */
  @EpHandler()
  async open(
    _,
    windowName: string,
    openParams?: Record<string, any>,
  ): Promise<number> {
    return await openWindow(windowName, openParams);
  }

  /**
   * 关闭当前窗口
   */
  @EpHandler()
  async close(e: IpcMainInvokeEvent) {
    BrowserWindow.fromWebContents(e.sender)?.close();
  }

  /**
   * 根据id关闭窗口
   * @param _
   * @param id 窗口id
   */
  @EpHandler()
  async closeById(_, id: number) {
    this.checkWindowId(id);
    closeWindow(id);
  }

  /**
   * 根据窗口名称关闭窗口
   * @param _
   * @param windowName 窗口名称
   */
  @EpHandler()
  async closeByName(_, windowName: string) {
    const multiWindow = findMultiWindowModule(windowName);
    if (multiWindow != null) {
      throw new Error('多窗口模式不可用');
    }

    (await getWindow(windowName))?.currentWindow?.close();
  }

  /**
   * 关闭多窗口的所有已打开的窗口
   * @param _
   * @param windowName 窗口名称
   */
  @EpHandler()
  async closeMultiByName(_, windowName: string): Promise<number[]> {
    return [...closeMultiByName(windowName)];
  }

  /**
   * 关闭多窗口的所有已打开的窗口ids
   * @param _
   * @param windowName 窗口名称
   */
  @EpHandler()
  async getMultiIdsByName(_, windowName: string): Promise<number[]> {
    return [...getMultiIdsByName(windowName)];
  }

  /**
   * 根据id显示窗口
   * @param _
   * @param id 窗口id
   */
  @EpHandler()
  async showById(_, id: number) {
    this.checkWindowId(id);
    showWindow(id);
  }

  /**
   * 根据id隐藏窗口
   * @param _
   * @param id 窗口id
   */
  @EpHandler()
  async hideById(_, id: number) {
    this.checkWindowId(id);
    hideWindow(id);
  }

  @EpHandler()
  async sendByName(e: IpcMainInvokeEvent, windowName: string, params: any) {
    const multiWindow = findMultiWindowModule(windowName);
    if (multiWindow != null) {
      throw new Error('多窗口模式不可用');
    }

    const browserWindow = BrowserWindow.fromWebContents(e.sender);
    if (browserWindow) {
      const baseWindow = await getWindow(windowName);
      if (baseWindow) {
        baseWindow.currentWindow?.webContents.send(
          EP_MESSAGE_EVENT_NAME,
          {
            epWindowId: browserWindow.id,
          },
          params,
        );
      }
    }
  }

  @EpHandler()
  async sendById(e: IpcMainInvokeEvent, id: number, params: any) {
    this.checkWindowId(id);
    const browserWindow = BrowserWindow.fromWebContents(e.sender);
    if (browserWindow) {
      const baseWindow = await findWindowModuleById(id);
      if (baseWindow) {
        baseWindow.currentWindow?.webContents.send(
          EP_MESSAGE_EVENT_NAME,
          {
            epWindowId: browserWindow.id,
          },
          params,
        );
      }
    }
  }

  @EpHandler()
  async sendMultiByName(
    e: IpcMainInvokeEvent,
    windowName: string,
    params: any,
  ) {
    const browserWindow = BrowserWindow.fromWebContents(e.sender);
    if (browserWindow) {
      const multiIds = getMultiIdsByName(windowName);
      for (const id of multiIds) {
        findWindowById(id)?.webContents.send(
          EP_MESSAGE_EVENT_NAME,
          {
            epWindowId: browserWindow.id,
          },
          params,
        );
      }
    }
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
