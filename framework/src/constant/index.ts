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
 * 获取窗口参数
 */
export const EP_PARAMS_EVENT_NAME = 'epParams';

/**
 * 获取sendToRenderer回调
 */
export const EP_SEND_TO_RENDERER_CHANNEL_NAME_EVENT_NAME =
  'epSendToRendererChannelName';

/**
 *设置窗口状态
 */
export const EP_READY_EVENT_NAME = 'epReady';

/**
 *窗口通讯
 */
export const EP_MESSAGE_EVENT_NAME = 'epMessage';

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
export const EP_SEND_TO_RENDERER_KEY = 'ep:ep_send_to_renderer';

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
 * EpMainWindow装饰器key
 */
export const EP_MAIN_WINDOW_DECORATOR_KEY = 'ep:main_window';

/**
 * EpMultiWindow装饰器key
 */
export const EP_MULTI_WINDOW_DECORATOR_KEY = 'ep:multi_window';
