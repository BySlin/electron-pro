import { createCustomMethodDecorator } from '@midwayjs/core';
import { EP_HANDLER_DECORATOR_KEY } from '../constant';

/**
 * ipcMain handle
 * @constructor
 * @param options once 只触发一次 printLog 打印日志
 */
export function EpHandler(options?: {
  once: boolean;
  printLog: boolean;
}): MethodDecorator {
  options = { once: false, printLog: true, ...options };

  // 我们传递了一个可以修改展示格式的参数
  return createCustomMethodDecorator(
    EP_HANDLER_DECORATOR_KEY,
    { ...options },
    false,
  );
}
