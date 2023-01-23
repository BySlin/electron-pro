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
  private id: number;

  async setUrl(url: string) {
    this.url = url;
    if (this.multiWindow) {
      this.onlyNoMultiError();
    } else {
      if (this.currentWindow) {
        await this.currentWindow.loadURL(this.url);
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

  getId() {
    if (this.multiWindow) {
      this.onlyNoMultiError();
    }
    return this.id;
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
    if (this.multiWindow) {
      this.onlyNoMultiError();
    }
    return this.currentWindow;
  }

  /**
   * 创建窗口之前
   */
  onInit() {}

  /**
   * 初始化窗口
   */
  onCreate(webContentsId: number) {}

  /**
   * 窗口关闭
   */
  onClose(webContentsId: number) {}

  /**
   * 窗口关闭
   */
  onClosed(webContentsId: number) {}

  /**
   * 关闭所有窗口
   */
  onCloseAll() {}

  onAlwaysTopChanged(isAlwaysOnTop: boolean, webContentsId?: number) {}

  /**
   * 开始创建窗口
   */
  async create(): Promise<number> {
    this.onInit();

    let item: BrowserWindow;
    if (this.multiWindow) {
      item = await createWindow(this.url, this.options);
      this.multiWindows.push(item);
    } else {
      if (this.initialized) {
        this.currentWindow.focus();
        return this.id;
      } else {
        item = await createWindow(this.url, this.options);
        this.id = item.webContents.id;
        this.currentWindow = item;
        this.initialized = true;
      }
    }

    const webContentsId = item.webContents.id;

    item.on('closed', () => {
      // console.log('close');
      this.onClose(webContentsId);
    });

    item.once('closed', () => {
      if (this.multiWindow) {
        this.multiWindows.forEach((value, index) => {
          if (value.isDestroyed()) {
            this.multiWindows.splice(index, 1);
          }
        });
      } else {
        if (this.currentWindow) {
          this.id = undefined;
          this.currentWindow = undefined;
          this.initialized = false;
        }
      }
      this.onClosed(webContentsId);
    });

    item.on('always-on-top-changed', (e, isAlwaysOnTop) =>
      this.onAlwaysTopChanged(isAlwaysOnTop, webContentsId),
    );

    await item.webContents.executeJavaScript(
      `
      window.epWindowName = '${getProviderName(this)}';
      window.epWebContentsId = ${webContentsId};
      `,
      true,
    );

    this.onCreate(webContentsId);
    return webContentsId;
  }

  /**
   * 关闭所有窗口
   * @private
   */
  closeAll() {
    if (this.multiWindow) {
      if (this.multiWindows.length > 0) {
        const promiseCloseWindows = [];

        for (const w of this.multiWindows) {
          promiseCloseWindows.push(
            new Promise<void>((resolve) => {
              w.close();
              resolve();
            }),
          );
        }

        Promise.all(promiseCloseWindows).then(() => {
          this.onCloseAll();
        });
      }
    } else {
      this.onlyMultiError();
    }
  }

  private onlyMultiError() {
    throw new Error('仅多窗口模式下支持');
  }

  private onlyNoMultiError() {
    throw new Error('仅非多窗口模式下支持');
  }
}
