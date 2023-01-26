import { BaseWindow } from './BaseWindow';
import { closeWindow, getEpProvideName } from '../utils';

export class BaseMultiWindow extends BaseWindow {
  private static windowIds = new Map<string, Set<number>>();

  static getWindowIds() {
    const epProvideName = getEpProvideName(this);
    return BaseMultiWindow.windowIds.get(epProvideName);
  }

  onCreate() {
    super.onCreate();
    const epProvideName = getEpProvideName(this);
    if (!BaseMultiWindow.windowIds.has(epProvideName)) {
      BaseMultiWindow.windowIds.set(epProvideName, new Set<number>());
    }

    BaseMultiWindow.windowIds.get(epProvideName)?.add(this.id);
  }

  onClosed() {
    super.onClosed();
    const epProvideName = getEpProvideName(this);
    BaseMultiWindow.windowIds.get(epProvideName)?.delete(this.id);
  }

  /**
   * 关闭所有窗口
   * @private
   */
  static closeAll() {
    const epProvideName = getEpProvideName(this);
    const windowIds = BaseMultiWindow.windowIds.get(epProvideName);
    if (windowIds && windowIds.size > 0) {
      for (const windowId of windowIds) {
        closeWindow(windowId);
      }
    }
    return windowIds;
  }
}
