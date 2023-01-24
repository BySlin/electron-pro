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
  onCreate(id: number) {}

  /**
   * 窗口关闭
   */
  onClose(id: number) {}

  /**
   * 窗口关闭
   */
  onClosed(id: number) {}

  /**
   * 关闭所有窗口
   */
  onCloseAll() {}

  onAlwaysTopChanged(isAlwaysOnTop: boolean, id?: number) {}

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
        this.id = item.id;
        this.currentWindow = item;
        this.initialized = true;
      }
    }

    const id = item.id;

    item.on('close', () => {
      this.onClose(id);
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
      this.onClosed(id);
    });

    item.on('always-on-top-changed', (e, isAlwaysOnTop) =>
      this.onAlwaysTopChanged(isAlwaysOnTop, id),
    );

    // Windows Or Linux Only
    item.on('app-command', (e, command) => {});

    //MacOS only
    item.on('new-window-for-tab', () => {});
    item.on('sheet-begin', () => {});
    item.on('sheet-end', () => {});
    item.on('swipe', (e, direction) => {});

    //Windows Only
    item.on('system-context-menu', (e, point) => {});
    item.on('session-end', () => {});

    //Windows Mac Only
    item.on('will-resize', (e, newBounds) => {});
    item.on('will-move', (e, newBounds) => {});
    item.on('resized', () => {});
    item.on('moved', () => {});

    //Common
    item.on('blur', () => {});
    item.on('enter-full-screen', () => {});
    item.on('enter-html-full-screen', () => {});
    item.on('focus', () => {});
    item.on('hide', () => {});
    item.on('leave-full-screen', () => {});
    item.on('leave-html-full-screen', () => {});
    item.on('maximize', () => {});
    item.on('minimize', () => {});
    item.on('move', () => {});
    item.on('page-title-updated', (e, title, explicitSet) => {});
    item.on('ready-to-show', () => {});
    item.on('resize', () => {});
    item.on('responsive', () => {});
    item.on('restore', () => {});
    item.on('rotate-gesture', (e, rotation) => {});
    item.on('show', () => {});
    item.on('unmaximize', () => {});
    item.on('unresponsive', () => {});

    await item.webContents.executeJavaScript(
      `
      window.epWindowName = '${getProviderName(this)}';
      window.epWindowId = ${id};
      `,
      true,
    );

    this.onCreate(id);
    return id;
  }

  /**
   * 关闭所有窗口
   * @private
   */
  closeAll() {
    if (this.multiWindow) {
      const result: number[] = [];
      if (this.multiWindows.length > 0) {
        const promiseCloseWindows = [];

        for (const w of this.multiWindows) {
          result.push(w.id);
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

      return result;
    } else {
      if (this.currentWindow) {
        this.currentWindow.close();
      }
    }
  }

  //@ts-ignore
  private onlyMultiError() {
    throw new Error('仅多窗口模式下支持');
  }

  private onlyNoMultiError() {
    throw new Error('仅非多窗口模式下支持');
  }
}
