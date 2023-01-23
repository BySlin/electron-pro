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
   * 初始化窗口
   */
  async onCreate(): Promise<number> {
    return this.create();
  }

  /**
   * 窗口关闭
   */
  onClose(webContentsId?: number) {
    this.close(webContentsId);
  }

  /**
   * 开始创建窗口
   */
  private async create(): Promise<number> {
    let item: BrowserWindow;
    if (this.multiWindow) {
      item = await createWindow(this.url, this.options);
      this.multiWindows.push(item);
    } else {
      if (this.initialized) {
        this.currentWindow.focus();
      } else {
        item = await createWindow(this.url, this.options);
        this.currentWindow = item;
        this.initialized = true;
      }
    }

    await item.webContents.executeJavaScript(
      `
      window.epWindowName = '${getProviderName(this)}';
      window.epWebContentId = '${item.webContents.id}';
      `,
      true,
    );
    return item.webContents.id;
  }

  /**
   * 关闭窗口
   * @private
   */
  private close(webContentsId?: number) {
    if (this.multiWindow) {
      const index = this.multiWindows.findIndex(
        (w) => w.webContents.id === webContentsId,
      );
      if (index != -1) {
        const browserWindow = this.multiWindows[index];
        browserWindow.close();
        this.multiWindows.splice(index, 1);
      }
    } else {
      this.currentWindow.close();
      this.currentWindow = undefined;
      this.initialized = false;
    }
  }

  show() {
    this.currentWindow.show();
  }

  hide() {
    this.currentWindow.hide();
  }
}
