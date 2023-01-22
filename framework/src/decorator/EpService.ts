import {
  Scope,
  ScopeEnum,
  saveClassMetadata,
  saveModule,
  Provide,
} from '@midwayjs/core';

// 提供一个唯一 key
const DECORATOR_KEY = 'ep:service';

export function EpService(): ClassDecorator {
  return (target: any) => {
    // 将装饰的类，绑定到该装饰器，用于后续能获取到 class
    saveModule(DECORATOR_KEY, target);
    // 保存一些元数据信息，任意你希望存的东西
    saveClassMetadata(
      DECORATOR_KEY,
      {
        test: 'abc',
      },
      target,
    );
    // 指定 IoC 容器创建实例的作用域，这里注册为请求作用域，这样能取到 ctx
    Scope(ScopeEnum.Singleton)(target);
    // 调用一下 Provide 装饰器，这样用户的 class 可以省略写 @Provide() 装饰器了
    Provide()(target);
  };
}
