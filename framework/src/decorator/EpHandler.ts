import { createCustomMethodDecorator } from '@midwayjs/core';
import { EP_HANDLER_DECORATOR_KEY } from '../constant';

/**
 * ipcMain handle
 * @param once 只触发一次
 * @constructor
 */
export function EpHandler(once = false): MethodDecorator {
  // 我们传递了一个可以修改展示格式的参数
  return createCustomMethodDecorator(EP_HANDLER_DECORATOR_KEY, { once }, false);
}
