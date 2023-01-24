import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { createWindow } from '../utils';
import { getProviderName } from '@midwayjs/core';

export class BaseWindow {
  private currentWindow: BrowserWindow;
  private url: string;
  private options: BrowserWindowConstructorOptions;

  private id: number;

  async setUrl(url: string) {
    this.url = url;
    if (this.currentWindow) {
      await this.currentWindow.loadURL(this.url);
    }
  }

  getUrl() {
    return this.url;
  }

  getOptions() {
    return this.options;
  }

  getId() {
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
  }) {
    const { url, options } = {
      options: {},
      ...params,
    };
    this.url = url;
    this.options = options;
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

  onAlwaysTopChanged(isAlwaysOnTop: boolean, id?: number) {}

  /**
   * 开始创建窗口
   */
  async create(): Promise<number> {
    if (this.currentWindow != undefined) {
      this.currentWindow.focus();
      return;
    }

    this.onInit();
    const item = await createWindow(this.url, this.options);
    this.id = item.id;
    this.currentWindow = item;

    const id = item.id;

    item.on('close', () => {
      this.onClose(id);
    });

    item.once('closed', () => {
      if (this.currentWindow) {
        this.id = undefined;
        this.currentWindow = undefined;
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
}
