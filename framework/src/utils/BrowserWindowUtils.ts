import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { PRELOAD_JS_PATH } from '../constant';
import { BaseWindow } from '../window';
import { getCurrentApplicationContext } from '@midwayjs/core';

export const createWindow = (
  url: string,
  options: BrowserWindowConstructorOptions = {},
) => {
  options.show = options.show ?? false;
  options.webPreferences = options.webPreferences ?? {};
  options.webPreferences.contextIsolation =
    options.webPreferences.contextIsolation ?? true;
  options.webPreferences.preload =
    options.webPreferences.preload ?? PRELOAD_JS_PATH;

  const win = new BrowserWindow(options);
  win.loadURL(url);
  win.once('ready-to-show', () => {
    win.show();
  });
  return win;
};

/**
 * 打开窗口
 * @param epWindowModule
 */
export const openWindow = (epWindowModule: typeof BaseWindow | string) => {
  getCurrentApplicationContext()
    .getAsync(epWindowModule as any)
    .then((epWindow: BaseWindow) => {
      epWindow.onCreate();
    });
};

/**
 * 关闭窗口
 * @param epWindowModule
 */
export const closeWindow = (epWindowModule: typeof BaseWindow | string) => {
  getCurrentApplicationContext()
    .getAsync(epWindowModule as any)
    .then((epWindow: BaseWindow) => {
      epWindow.onClose();
    });
};
