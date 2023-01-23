import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { createWindow } from '../utils';

export class BaseWindow {
  private currentWindow: BrowserWindow;
  private url: string;
  private options: BrowserWindowConstructorOptions;
  private initialized = false;

  setUrl(url: string) {
    this.url = url;
  }

  getUrl() {
    return this.url;
  }

  setOptions(options: BrowserWindowConstructorOptions) {
    this.options = options;
  }

  getOptions() {
    return this.options;
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
  onCreate() {
    this.create();
  }

  /**
   * 窗口关闭
   */
  onClose() {
    this.close();
  }

  /**
   * 开始创建窗口
   */
  private create() {
    if (this.initialized) {
      this.currentWindow.focus();
      return;
    }

    this.currentWindow = createWindow(this.url, this.options);
    this.initialized = true;
  }

  /**
   * 关闭窗口
   * @private
   */
  private close() {
    this.currentWindow.close();
  }

  show() {
    this.currentWindow.show();
  }

  hide() {
    this.currentWindow.hide();
  }
}
