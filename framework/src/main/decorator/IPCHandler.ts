import { ServiceStorage } from '../ServiceStorage';
import { IPC_EVENT_SEPARATOR } from '../constant';
import { IPCController } from '../interface';

export function IPCHandler(): PropertyDecorator {
  return (target: Object, methodName: any) => {
    const targetClassName = target.constructor.name;
    const eventName = `${targetClassName}${IPC_EVENT_SEPARATOR}${methodName}`;
    if (target instanceof IPCController) {
      const actions = ServiceStorage.services.get(target.constructor) || [];
      actions.push({
        eventName,
        methodName,
      });
      ServiceStorage.services.set(target.constructor, actions);
    } else {
      console.error(`ERROR:${eventName},此装饰器只在IPCController类上生效`);
    }
  };
}
