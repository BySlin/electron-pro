import * as path from 'path';

/**
 * 是否开发环境
 */
const isDevelopment = process.env.NODE_ENV === 'development';
/**
 * 事件分隔符
 */
export const IPC_EVENT_SEPARATOR = '@';

/**
 * 获取所有ipcEvent事件
 */
export const GET_IPC_ALL_EVENT_NAME = 'EpAppController@allIpcEvent';

/**
 * preloadjs路径
 */
export const PRELOAD_JS_PATH = path.join(__dirname, '..', 'preload.js');
