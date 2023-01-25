import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import {
  EP_MULTI_WINDOW_DECORATOR_KEY,
  EP_WINDOW_DECORATOR_KEY,
  PRELOAD_JS_PATH,
} from '../constant';
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
 * @param epWindowModule 模块名称或类型
 * @param openParams 参数
 */
export const openWindow = async (
  epWindowModule: typeof BaseWindow | string,
  openParams?: Record<string, any>,
) => {
  const epWindow = await getWindow(epWindowModule);
  return await epWindow?.create(openParams);
};

/**
 * 获取某个window
 * @param epWindowModule
 */
export const getWindow = async (
  epWindowModule: typeof BaseWindow | string,
): Promise<BaseWindow | undefined> => {
  const epWindow = (await getCurrentApplicationContext().getAsync(
    epWindowModule as any,
  )) as BaseWindow;

  return epWindow;
};

/**
 * 根据id查找module
 * @param id
 */
export const findWindowModuleById = async (id: number) => {
  const epWindowModules = listModule(EP_WINDOW_DECORATOR_KEY);
  if (epWindowModules) {
    for (const epWindowModule of epWindowModules) {
      const epWindow = (await getCurrentApplicationContext().getAsync(
        epWindowModule as any,
      )) as BaseWindow;

      if (epWindow.id === id) {
        return epWindow;
      }
    }
  }

  return undefined;
};

/**
 * 关闭所有窗口
 * @param epMultiWindowModule
 */
export const closeMultiByName = (
  epMultiWindowModule: typeof BaseMultiWindow | string,
) => {
  return (
    findMultiWindowModule(epMultiWindowModule)?.closeAll() ?? new Set<number>()
  );
};

/**
 * 获取多窗口的所有窗口id
 * @param epMultiWindowModule
 */
export const getMultiIdsByName = (
  epMultiWindowModule: typeof BaseMultiWindow | string,
) => {
  return (
    findMultiWindowModule(epMultiWindowModule)?.getWindowIds() ??
    new Set<number>()
  );
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
