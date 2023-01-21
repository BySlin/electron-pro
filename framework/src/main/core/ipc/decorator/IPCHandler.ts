import { ServiceStorage } from '../../ServiceStorage';
import { IPC_EVENT_SEPARATOR } from '../constant';

export function IPCHandler(): PropertyDecorator {
  return (target: Object, methodName: any) => {
    const targetClassName = target.constructor.name;

    const actions = ServiceStorage.services.get(target.constructor) || [];
    actions.push({
      eventName: `${targetClassName}${IPC_EVENT_SEPARATOR}${methodName}`,
      methodName,
    });
    ServiceStorage.services.set(target.constructor, actions);
  };
}
