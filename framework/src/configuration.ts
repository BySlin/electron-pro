import {
  Configuration,
  ILifeCycle,
  ILogger,
  IMidwayContainer,
  Inject,
  MidwayConfigService,
} from '@midwayjs/core';

import * as DefaultConfig from './config/config.default';
import { EpConfig } from './index';
import { app } from 'electron';
import { IpcMainWorker } from './provide';

@Configuration({
  namespace: 'ep',
  imports: [],
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class EpConfiguration implements ILifeCycle {
  @Inject()
  logger: ILogger;
  @Inject()
  ipcMainWorker: IpcMainWorker;

  async onConfigLoad(container: IMidwayContainer): Promise<any> {
    this.logger.info('[Electron-Pro] 配置加载完成');
    const configService = await container.getAsync(MidwayConfigService);
    const epConfig = configService.getConfiguration('ep') as EpConfig;

    if (epConfig.singletonProcess) {
      // 控制单例进程
      const isSingle = app.requestSingleInstanceLock();
      if (!isSingle) {
        app.exit(0);
      }
    }
  }

  async onReady(container: IMidwayContainer) {
    this.logger.info('[Electron-Pro] 框架启动完成');
    this.ipcMainWorker.registerIpcHandle();
    this.ipcMainWorker.registerIpcRendererSend();
  }
}
