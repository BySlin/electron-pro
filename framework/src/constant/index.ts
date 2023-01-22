import * as path from 'path';

/**
 * 是否开发环境
 */
export const isDevelopment = process.env.NODE_ENV === 'development';
/**
 * 事件分隔符
 */
export const IPC_EVENT_SEPARATOR = '@';

/**
 * 获取所有ipcEvent事件
 */
export const GET_IPC_ALL_EVENT_NAME = 'epAppController@allIpcHandleChannelName';

/**
 * preloadjs路径
 */
export const PRELOAD_JS_PATH = path.join(__dirname, '..', 'preload.js');

/**
 * EpHandler装饰器key
 */
export const EP_HANDLER_DECORATOR_KEY = 'ep:ep_handler';

/**
 * EpSendRenderer装饰器key
 */
export const EP_SEND_RENDERER_KEY = 'ep:ep_send_renderer';

/**
 * EpController装饰器key
 */
export const EP_CONTROLLER_DECORATOR_KEY = 'ep:controller';

/**
 * EpService装饰器key
 */
export const EP_SERVICE_DECORATOR_KEY = 'ep:service';

/**
 * EpWindow装饰器key
 */
export const EP_WINDOW_DECORATOR_KEY = 'ep:window';

/**
 * EpCurrentWindow装饰器key
 */
export const EP_CURRENT_WINDOW_DECORATOR_KEY = 'ep:current_window';
