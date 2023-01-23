import {
  Autoload,
  ILogger,
  Init,
  Inject,
  listModule,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import { EP_MAIN_WINDOW_DECORATOR_KEY } from '../constant';
import { BaseWindow } from '../window';
import { openWindow } from '../utils';

@Provide()
@Scope(ScopeEnum.Singleton)
@Autoload()
export class MainWindowWorker {
  @Inject()
  logger: ILogger;

  @Init()
  init() {
    const epMainWindowModules = listModule(EP_MAIN_WINDOW_DECORATOR_KEY);
    if (epMainWindowModules) {
      for (const epMainWindowModule of epMainWindowModules) {
        this.openMainWindow(epMainWindowModule);
      }
    }
  }

  /**
   * 打开主窗口
   */
  openMainWindow(epMainWindowModule: typeof BaseWindow) {
    openWindow(epMainWindowModule);
  }
}
