import { BaseWindow } from './BaseWindow';
import { closeWindow } from '../utils';

export class BaseMultiWindow extends BaseWindow {
  private static windowIds: Set<number> = new Set();

  static getWindowIds() {
    return BaseMultiWindow.windowIds;
  }

  onCreate(id: number) {
    super.onCreate(id);
    BaseMultiWindow.windowIds.add(id);
  }

  onClosed(id: number) {
    super.onClosed(id);

    BaseMultiWindow.windowIds.delete(id);
  }

  /**
   * 关闭所有窗口
   * @private
   */
  static closeAll() {
    if (BaseMultiWindow.windowIds.size > 0) {
      for (const windowId of BaseMultiWindow.windowIds) {
        closeWindow(windowId);
      }
    }
    return BaseMultiWindow.windowIds;
  }
}
