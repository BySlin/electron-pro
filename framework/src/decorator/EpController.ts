import { saveClassMetadata, saveModule } from '@midwayjs/core';
import { EP_CONTROLLER_DECORATOR_KEY } from '../constant';
import { EpService } from './EpService';

export function EpController(): ClassDecorator {
  return (target: any) => {
    // 将装饰的类，绑定到该装饰器，用于后续能获取到 class
    saveModule(EP_CONTROLLER_DECORATOR_KEY, target);
    // 保存一些元数据信息，任意你希望存的东西
    saveClassMetadata(EP_CONTROLLER_DECORATOR_KEY, {}, target);
    //继承EpService
    EpService()(target);
  };
}
