import {
  Autoload,
  getCurrentApplicationContext,
  ILogger,
  Init,
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
import { ipcMain } from 'electron';
import { EP_SEND_RENDERER_KEY } from '../constant';
import { BaseWindow } from '../window';

@Provide()
@Scope(ScopeEnum.Singleton)
@Autoload()
export class IpcMainWorker {
  @Inject()
  logger: ILogger;
  @Inject()
  midwayDecoratorService: MidwayDecoratorService;

  @Init()
  init() {
    this.registerIpcHandle();
    this.registerIpcRendererSend();
  }

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

  /**
   * 注册ipcRenderer send 返回装饰器
   */
  registerIpcRendererSend() {
    // 实现方法装饰器
    this.midwayDecoratorService.registerMethodHandler(
      EP_SEND_RENDERER_KEY,
      ({ target, metadata }) => {
        return {
          around: async (joinPoint: JoinPoint) => {
            // 执行原方法
            const result = await joinPoint.proceed(...joinPoint.args);

            const targetWindow = joinPoint.target;
            //判断是否继承BaseWindow
            if (BaseWindow.prototype.isPrototypeOf(targetWindow)) {
              const currentWindow = (
                targetWindow as BaseWindow
              ).getCurrentWindow();

              currentWindow.webContents.send(
                getIpcRendererSendChannelName(
                  target,
                  joinPoint.methodName,
                  metadata,
                ),
                result,
              );
            }

            // 返回执行结果
            return result;
          },
        };
      },
    );
  }
}
