import { EventEmitter } from 'events';
import { app, protocol } from 'electron';
import { createProtocol } from './createProtocol';

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

  constructor(options?: AppOptions) {
    super();
    this.options = { ...defaultOptions, ...options };
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

    await app.whenReady();

    createProtocol('app');
  }
}
