import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { createWindow } from '../utils';
import { getProviderName } from '@midwayjs/core';

export class BaseWindow {
  private _currentWindow: BrowserWindow;
  private _url: string;
  private _options: BrowserWindowConstructorOptions = {};

  private _id: number;

  get url() {
    return this._url;
  }

  get id() {
    return this._id;
  }

  /**
   * 获取当前window
   */
  get currentWindow() {
    return this._currentWindow;
  }

  /**
   * 初始化参数
   * @param params
   * @protected
   */
  protected initParams(params?: {
    url?: string;
    options?: BrowserWindowConstructorOptions;
  }) {
    const { url, options } = {
      options: {},
      ...params,
    };
    this._url = url;
    this._options = options;
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
   * 开始创建窗口
   */
  async create(): Promise<number> {
    if (this._currentWindow != undefined) {
      this._currentWindow.focus();
      return this._id;
    }

    this.onInit();

    const item = await createWindow(this._options);
    this._id = item.id;
    this._currentWindow = item;
    this.loadUrl(this._url);

    item.on('close', () => {
      this.onClose(this._id);
    });

    item.once('closed', () => {
      this.onClosed(this._id);
      if (this._currentWindow) {
        this._id = undefined;
        this._currentWindow = undefined;
      }
    });

    item.on('always-on-top-changed', (e, isAlwaysOnTop) => {});

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

    this.onCreate(this._id);
    return this._id;
  }

  /**
   * 加载url
   * @param url
   */
  async loadUrl(url: string) {
    this._url = url;
    if (this._currentWindow && this._url != null) {
      await this._currentWindow.loadURL(this._url);
      await this.injectParams();
    }
  }

  /**
   * 注入参数
   * @private
   */
  private async injectParams() {
    if (this._currentWindow) {
      await this._currentWindow.webContents.executeJavaScript(
        `
      window.epWindowName = '${getProviderName(this)}';
      window.epWindowId = ${this._id};
      `,
        true,
      );
    }
  }
}
