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
  const defaultShowIsNull = typeof options.show === 'undefined';

  options.show = options.show ?? false;
  options.webPreferences = options.webPreferences ?? {};
  options.webPreferences.contextIsolation =
    options.webPreferences.contextIsolation ?? true;
  options.webPreferences.preload =
    options.webPreferences.preload ?? PRELOAD_JS_PATH;

  const win = new BrowserWindow(options);
  await win.loadURL(url);

  if (defaultShowIsNull) {
    win.once('ready-to-show', () => {
      win.show();
    });
  }

  return win;
};

/**
 * 根据id查找window
 * @param id windowId
 */
export const findWindowById = (id: number) => {
  return BrowserWindow.fromId(id);
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
 * 关闭所有窗口
 * @param epWindowModule
 */
export const closeAllByWindowName = async (
  epWindowModule: typeof BaseWindow | string,
) => {
  const epWindow = (await getCurrentApplicationContext().getAsync(
    epWindowModule as any,
  )) as BaseWindow;

  return epWindow.closeAll();
};

/**
 * 关闭窗口
 * @param id id
 */
export const closeWindow = (id: number) => {
  findWindowById(id)?.close();
};

/**
 * 显示window
 * @param id
 */
export const showWindow = (id: number) => {
  findWindowById(id)?.show();
};

/**
 * 隐藏window
 * @param id
 */
export const hideWindow = (id: number) => {
  findWindowById(id)?.hide();
};
