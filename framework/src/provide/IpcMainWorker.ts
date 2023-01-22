import {
  getCurrentApplicationContext,
  ILogger,
  Inject,
  JoinPoint,
  MidwayDecoratorService,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import {
  getAllIpcHandleChannel,
  getIpcRendererSendChannelName,
} from '../utils';
import { BrowserWindow, ipcMain } from 'electron';
import { EP_SEND_RENDERER_KEY } from '../constant';

@Provide()
@Scope(ScopeEnum.Singleton)
export class IpcMainWorker {
  @Inject()
  logger: ILogger;
  @Inject()
  midwayDecoratorService: MidwayDecoratorService;

  /**
   * 注册ipcHandle
   */
  registerIpcHandle() {
    const allIpcHandle = getAllIpcHandleChannel();

    for (const {
      channelName,
      methodName,
      target,
      once,
      printLog,
    } of allIpcHandle) {
      ipcMain[once ? 'handleOnce' : 'handle'](
        channelName,
        async (e, ...data) => {
          try {
            if (printLog) {
              this.logger.info(
                `触发${channelName}${
                  data?.length > 0 ? `,${JSON.stringify(data)}` : ''
                }`,
              );
            }
            const epController = await getCurrentApplicationContext().getAsync(
              target,
            );
            return await epController[methodName](...data);
          } catch (error) {
            this.logger.error(error);
            // @ts-ignore
            return { error: error.message };
          }
        },
      );
    }
  }

  registerIpcRendererSend() {
    // 实现方法装饰器
    this.midwayDecoratorService.registerMethodHandler(
      EP_SEND_RENDERER_KEY,
      ({ target, metadata }) => {
        const { windowPropertyName } = metadata as {
          once: boolean;
          windowPropertyName: string;
        };

        return {
          around: async (joinPoint: JoinPoint) => {
            // 执行原方法
            const result = await joinPoint.proceed(...joinPoint.args);

            const targetWindow = joinPoint.target[windowPropertyName];
            if (targetWindow) {
              if (
                targetWindow?.constructor?.name === 'BrowserWindow' ||
                targetWindow?.constructor?.name === 'BrowserView'
              ) {
                (targetWindow as BrowserWindow).webContents.send(
                  getIpcRendererSendChannelName(
                    target,
                    joinPoint.methodName,
                    metadata,
                  ),
                  result,
                );
              }
            }

            // 返回执行结果
            return result;
          },
        };
      },
    );
  }
}
