import { createCustomMethodDecorator } from '@midwayjs/core';
import { EP_HANDLER_DECORATOR_KEY } from '../constant';

export function EpHandler(): MethodDecorator {
  // 我们传递了一个可以修改展示格式的参数
  return createCustomMethodDecorator(EP_HANDLER_DECORATOR_KEY, {}, false);
}
