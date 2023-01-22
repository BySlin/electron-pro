import { EventEmitter } from 'events';
import { app, ipcMain, protocol } from 'electron';
import { createProtocol } from './createProtocol';
import { EPService, IPCController } from './interface';
import { ServiceStorage } from './ServiceStorage';
import { EpAppController } from './controller';

export const isDevelopment = process.env.NODE_ENV === 'development';

export type AppOptions = {
  /**
   * 单例进程
   */
  singletonProcess?: boolean;
};

export const defaultOptions: AppOptions = {
  singletonProcess: true,
};

export class App extends EventEmitter {
  options: AppOptions;

  services = new WeakMap<typeof EPService, EPService>();

  serviceEventMap = new Map<string, any>();

  constructor(options?: AppOptions) {
    super();
    this.options = { ...defaultOptions, ...options };
    this.registerController(EpAppController);
  }

  /**
   * 注册IPC控制器
   * @param clz
   */
  registerController(...clz: (typeof IPCController)[]) {
    this.registerService(...clz);
  }

  /**
   * 注册Service
   * @param clz
   */
  registerService(...clz: (typeof EPService)[]) {
    for (const epService of clz) {
      const service = new epService(this);
      this.services.set(epService, service);

      ServiceStorage.services.get(epService)?.forEach((event) => {
        // 将 event 装饰器中的对象全部存到 ServiceEventMap 中
        this.serviceEventMap.set(event.eventName, {
          service,
          methodName: event.methodName,
        });
      });

      const _services = this.services;

      ServiceStorage.injectProperty
        .get(epService)
        ?.forEach(({ propertyKey, clz }) => {
          //依赖注入
          Object.defineProperty(service, propertyKey, {
            get(): any {
              return _services.get(clz);
            },
          });
        });
    }
  }

  async bootstrap() {
    if (this.options.singletonProcess) {
      // 控制单例进程
      const isSingle = app.requestSingleInstanceLock();
      if (!isSingle) {
        app.exit(0);
      }
    }

    //注册自定义协议
    protocol.registerSchemesAsPrivileged([
      {
        scheme: 'app',
        privileges: {
          secure: true,
          standard: true,
          supportFetchAPI: true,
        },
      },
    ]);

    // 批量注册 service 中 event 事件 供 webview 消费
    this.serviceEventMap.forEach((serviceInfo, key) => {
      // 获取相应方法
      const { service, methodName } = serviceInfo;

      ipcMain.handle(key, async (e, ...data) => {
        try {
          return await service[methodName](...data);
        } catch (error) {
          // @ts-ignore
          return { error: error.message };
        }
      });
    });

    await app.whenReady();

    createProtocol('app');
  }
}
