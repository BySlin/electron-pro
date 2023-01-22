import { EPService } from './interface';

export class ServiceStorage {
  static services: WeakMap<any, { eventName: string; methodName: string }[]> =
    new WeakMap();

  static injectProperty: WeakMap<
    any,
    { clz: typeof EPService; propertyKey: string }[]
  > = new WeakMap();
}
