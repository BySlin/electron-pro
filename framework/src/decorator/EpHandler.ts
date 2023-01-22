import { createCustomMethodDecorator } from '@midwayjs/core';
// 装饰器内部的唯一 id
const DECORATOR_KEY = 'ep:ep_handler';

export function EpHandler(): MethodDecorator {
  // 我们传递了一个可以修改展示格式的参数
  return createCustomMethodDecorator(DECORATOR_KEY, {});
}
