import { EPService } from '../interface';
import { ServiceStorage } from '../ServiceStorage';

export function Inject(clz: typeof EPService): PropertyDecorator {
  return (target: Object, propertyKey: any) => {
    const actions = ServiceStorage.injectProperty.get(target.constructor) || [];
    actions.push({
      propertyKey,
      clz,
    });
    ServiceStorage.injectProperty.set(target.constructor, actions);
  };
}
