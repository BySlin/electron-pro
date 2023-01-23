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
import { openWindow } from '../utils';
import { app, BrowserWindow } from 'electron';

@Provide()
@Scope(ScopeEnum.Singleton)
@Autoload()
export class MainWindowWorker {
  @Inject()
  logger: ILogger;

  @Init()
  async init() {
    await this.openMainWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.openMainWindow();
      }
    });
  }

  /**
   * 打开主窗口
   */
  async openMainWindow() {
    const epMainWindowModules = listModule(EP_MAIN_WINDOW_DECORATOR_KEY);
    if (epMainWindowModules) {
      for (const epMainWindowModule of epMainWindowModules) {
        await openWindow(epMainWindowModule);
      }
    }
  }
}
