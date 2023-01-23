import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { createWindow } from '../utils';
import { getProviderName } from '@midwayjs/core';

export class BaseWindow {
  private currentWindow: BrowserWindow;
  private url: string;
  private options: BrowserWindowConstructorOptions;
  private multiWindow: boolean = false;
  private multiWindows: BrowserWindow[] = [];

  private initialized = false;

  setUrl(url: string) {
    this.url = url;
    if (this.multiWindow) {
      throw new Error('多窗口模式下不支持');
    } else {
      if (this.currentWindow) {
        this.currentWindow.loadURL(this.url);
      }
    }
  }

  getUrl() {
    return this.url;
  }

  getOptions() {
    return this.options;
  }

  getMultiWindow() {
    return this.multiWindow;
  }

  getMultiWindows() {
    return this.multiWindows;
  }

  /**
   * 初始化参数
   * @param params
   * @protected
   */
  protected initParams(params: {
    url: string;
    options?: BrowserWindowConstructorOptions;
    multiWindow?: boolean;
  }) {
    const { url, options, multiWindow } = {
      options: {},
      multiWindow: false,
      ...params,
    };
    this.url = url;
    this.options = options;
    this.multiWindow = multiWindow;
  }

  /**
   * 获取当前window
   */
  getCurrentWindow() {
    return this.currentWindow;
  }

  /**
   * 创建窗口之前
   */
  onBeforeCreate() {}

  /**
   * 初始化窗口
   */
  onCreate(webContentsId: number) {}

  /**
   * 窗口关闭
   */
  onClose(webContentsId?: number) {}

  /**
   * 关闭所有窗口
   */
  onCloseAll() {
    this.closeAll();
  }

  /**
   * 开始创建窗口
   */
  async create(): Promise<number> {
    this.onBeforeCreate();

    let item: BrowserWindow;
    if (this.multiWindow) {
      item = await createWindow(this.url, this.options);
      this.multiWindows.push(item);
    } else {
      if (this.initialized) {
        this.currentWindow.focus();
        return this.currentWindow.webContents.id;
      } else {
        item = await createWindow(this.url, this.options);
        this.currentWindow = item;
        this.initialized = true;
      }
    }

    await item.webContents.executeJavaScript(
      `
      window.epWindowName = '${getProviderName(this)}';
      window.epWebContentsId = ${item.webContents.id};
      `,
      true,
    );

    this.onCreate(item.webContents.id);
    return item.webContents.id;
  }

  /**
   * 关闭窗口
   * @private
   */
  close(webContentsId?: number) {
    if (this.multiWindow) {
      const index = this.multiWindows.findIndex(
        (w) => w.webContents.id === webContentsId,
      );
      if (index != -1) {
        const browserWindow = this.multiWindows[index];
        browserWindow.close();
        this.multiWindows.splice(index, 1);
        this.onClose(webContentsId);
      }
    } else {
      if (this.currentWindow) {
        this.currentWindow.close();
        this.currentWindow = undefined;
        this.initialized = false;
        this.onClose();
      }
    }
  }

  /**
   * 关闭所有窗口
   * @private
   */
  closeAll() {
    if (this.multiWindow) {
      if (this.multiWindows.length > 0) {
        this.multiWindows.forEach((w) => w.close());
        this.multiWindows = [];
        this.onCloseAll();
      }
    } else {
      if (this.currentWindow) {
        this.currentWindow.close();
        this.currentWindow = undefined;
        this.initialized = false;
        this.onCloseAll();
      }
    }
  }

  show() {
    this.currentWindow.show();
  }

  hide() {
    this.currentWindow.hide();
  }
}
