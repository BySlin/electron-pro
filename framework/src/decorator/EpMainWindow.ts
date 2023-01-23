import {
  Provide,
  saveClassMetadata,
  saveModule,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import { EP_MAIN_WINDOW_DECORATOR_KEY } from '../constant';

/**
 * 主窗口
 * @constructor
 */
export function EpMainWindow(): ClassDecorator {
  return (target: any) => {
    // 将装饰的类，绑定到该装饰器，用于后续能获取到 class
    saveModule(EP_MAIN_WINDOW_DECORATOR_KEY, target);
    // 保存一些元数据信息，任意你希望存的东西
    saveClassMetadata(EP_MAIN_WINDOW_DECORATOR_KEY, {}, target);
    // 指定 IoC 容器创建实例的作用域，这里注册为请求作用域，这样能取到 ctx
    Scope(ScopeEnum.Singleton)(target);
    // 调用一下 Provide 装饰器，这样用户的 class 可以省略写 @Provide() 装饰器了
    Provide()(target);
  };
}
