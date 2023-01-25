import { BaseWindow } from './BaseWindow';
import { closeWindow } from '../utils';

export class BaseMultiWindow extends BaseWindow {
  private static windowIds: Set<number> = new Set();

  static getWindowIds() {
    return BaseMultiWindow.windowIds;
  }

  onCreate() {
    super.onCreate();
    BaseMultiWindow.windowIds.add(this.id);
  }

  onClosed() {
    super.onClosed();
    BaseMultiWindow.windowIds.delete(this.id);
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
