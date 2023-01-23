import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { PRELOAD_JS_PATH } from '../constant';
import { BaseWindow } from '../window';
import { getCurrentApplicationContext } from '@midwayjs/core';

/**
 * 创建window
 * @param url
 * @param options
 */
export const createWindow = async (
  url: string,
  options: BrowserWindowConstructorOptions = {},
) => {
  const defaultShow = options.show == undefined;
  options.show = options.show ?? false;
  options.webPreferences = options.webPreferences ?? {};
  options.webPreferences.contextIsolation =
    options.webPreferences.contextIsolation ?? true;
  options.webPreferences.preload =
    options.webPreferences.preload ?? PRELOAD_JS_PATH;

  const win = new BrowserWindow(options);
  await win.loadURL(url);

  if (!defaultShow) {
    win.once('ready-to-show', () => {
      win.show();
    });
  }

  return win;
};

/**
 * 打开窗口
 * @param epWindowModule
 */
export const openWindow = async (
  epWindowModule: typeof BaseWindow | string,
) => {
  const epWindow = (await getCurrentApplicationContext().getAsync(
    epWindowModule as any,
  )) as BaseWindow;

  return await epWindow.create();
};

/**
 * 关闭窗口
 * @param epWindowModule
 * @param webContentsId webContentsId
 */
export const closeWindow = async (
  epWindowModule: typeof BaseWindow | string,
  webContentsId?: number,
) => {
  const epWindow = (await getCurrentApplicationContext().getAsync(
    epWindowModule as any,
  )) as BaseWindow;

  epWindow.close(webContentsId);
};

/**
 * 关闭所有窗口
 * @param epWindowModule
 */
export const closeAllWindow = async (
  epWindowModule: typeof BaseWindow | string,
) => {
  const epWindow = (await getCurrentApplicationContext().getAsync(
    epWindowModule as any,
  )) as BaseWindow;

  epWindow.closeAll();
};
