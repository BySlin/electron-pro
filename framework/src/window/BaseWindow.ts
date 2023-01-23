import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { createWindow } from '../utils';

export class BaseWindow {
  private currentWindow: BrowserWindow;
  private url: string;
  private options: BrowserWindowConstructorOptions;

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
    this.currentWindow = createWindow(this.url, this.options);
  }

  private close() {
    this.currentWindow.close();
  }
}
