import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { EP_MULTI_WINDOW_DECORATOR_KEY, PRELOAD_JS_PATH } from '../constant';
import { BaseMultiWindow, BaseWindow } from '../window';
import {
  getCurrentApplicationContext,
  getProviderName,
  listModule,
} from '@midwayjs/core';

/**
 * 创建window
 * @param options
 */
export const createWindow = async (
  options: BrowserWindowConstructorOptions = {},
) => {
  options.webPreferences = options.webPreferences ?? {};

  options.webPreferences.contextIsolation =
    options.webPreferences.contextIsolation ?? true;

  options.webPreferences.preload =
    options.webPreferences.preload ?? PRELOAD_JS_PATH;

  return new BrowserWindow(options);
};

/**
 * 根据id查找window
 * @param id windowId
 */
export const findWindowById = (id: number) => {
  return BrowserWindow.fromId(id);
};

/**
 * 查找多窗口类型
 * @param epMultiWindowModule
 */
export const findMultiWindowModule = (
  epMultiWindowModule: typeof BaseMultiWindow | string,
): typeof BaseMultiWindow | undefined => {
  const epWindowModules = listModule(
    EP_MULTI_WINDOW_DECORATOR_KEY,
    (module) => {
      return typeof epMultiWindowModule === 'string'
        ? getProviderName(module) === epMultiWindowModule
        : module === epMultiWindowModule;
    },
  ) as (typeof BaseMultiWindow)[];

  return epWindowModules[0];
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
 * @param epMultiWindowModule
 */
export const closeAllByWindowName = (
  epMultiWindowModule: typeof BaseMultiWindow | string,
) => {
  return findMultiWindowModule(epMultiWindowModule)?.closeAll();
};

/**
 * 关闭所有窗口
 * @param epMultiWindowModule
 */
export const getWindowIdsByWindowName = (
  epMultiWindowModule: typeof BaseMultiWindow | string,
) => {
  return findMultiWindowModule(epMultiWindowModule)?.getWindowIds();
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
