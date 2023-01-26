import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import {
  createWindow,
  getWindowIpcHandleChannel,
  getWindowIpcSendToRendererChannel,
} from '../utils';
import { getProviderName, ILogger, Inject } from '@midwayjs/core';
import {
  EP_PARAMS_EVENT_NAME,
  EP_READY_EVENT_NAME,
  EP_SEND_TO_RENDERER_CHANNEL_NAME_EVENT_NAME,
} from '../constant';

export class BaseWindow {
  @Inject()
  logger: ILogger;

  /**
   * Electron窗口
   * @private
   */
  private _currentWindow: BrowserWindow;
  /**
   * Electron加载的Url
   * @private
   */
  private _url: string;
  /**
   * Electron参数
   * @private
   */
  private _options: BrowserWindowConstructorOptions = {};
  /**
   * Electron 窗口启动参数
   * @private
   */
  private _openParams: Record<string, any>;
  /**
   * 窗口id
   * @private
   */
  private _id: number;

  /**
   * 窗口启动参数
   */
  get openParams() {
    return this._openParams;
  }

  /**
   * Electron加载的Url
   */
  get url() {
    return this._url;
  }

  /**
   * 窗口id
   */
  get id() {
    return this._id;
  }

  /**
   * Electron参数
   */
  get options() {
    return this._options;
  }

  /**
   * 获取当前window
   */
  get currentWindow() {
    return this._currentWindow;
  }

  /**
   * 初始化参数
   * @param params
   * @protected
   */
  protected initParams(params?: {
    url?: string;
    options?: BrowserWindowConstructorOptions;
  }) {
    const { url, options } = {
      options: {},
      ...params,
    };
    this._url = url;
    this._options = options;
  }

  /**
   * 创建窗口之前
   */
  onInit() {}

  /**
   * 初始化窗口
   */
  onCreate() {}

  /**
   * 窗口关闭
   */
  onClose() {}

  /**
   * 窗口关闭
   */
  onClosed() {}

  /**
   * 开始创建窗口
   */
  async create(openParams?: Record<string, any>): Promise<number> {
    if (this._currentWindow != undefined) {
      this._currentWindow.focus();
      return this._id;
    }

    this._openParams = openParams;
    this.onInit();

    const item = await createWindow(this._options);
    this._id = item.id;
    this._currentWindow = item;

    item.on('close', () => {
      this.onClose();
    });

    item.once('closed', () => {
      this.onClosed();
      if (this._currentWindow) {
        this._id = undefined;
        this._currentWindow = undefined;
      }
    });

    // item.on('always-on-top-changed', (e, isAlwaysOnTop) => {});

    // Windows Or Linux Only
    // item.on('app-command', (e, command) => {});

    // MacOS only
    // item.on('new-window-for-tab', () => {});
    // item.on('sheet-begin', () => {});
    // item.on('sheet-end', () => {});
    // item.on('swipe', (e, direction) => {});

    // Windows Only
    // item.on('system-context-menu', (e, point) => {});
    // item.on('session-end', () => {});

    // Windows Mac Only
    // item.on('will-resize', (e, newBounds) => {});
    // item.on('will-move', (e, newBounds) => {});
    // item.on('resized', () => {});
    // item.on('moved', () => {});

    // Common
    // item.on('blur', () => {});
    // item.on('enter-full-screen', () => {});
    // item.on('enter-html-full-screen', () => {});
    // item.on('focus', () => {});
    // item.on('hide', () => {});
    // item.on('leave-full-screen', () => {});
    // item.on('leave-html-full-screen', () => {});
    // item.on('maximize', () => {});
    // item.on('minimize', () => {});
    // item.on('move', () => {});
    // item.on('page-title-updated', (e, title, explicitSet) => {});
    // item.on('ready-to-show', () => {});
    // item.on('resize', () => {});
    // item.on('responsive', () => {});
    // item.on('restore', () => {});
    // item.on('rotate-gesture', (e, rotation) => {});
    // item.on('show', () => {});
    // item.on('unmaximize', () => {});
    // item.on('unresponsive', () => {});

    const currentIpcHandleChannel = getWindowIpcHandleChannel(this);

    //注册此窗口的ipc handle
    for (const {
      channelName,
      methodName,
      once,
      printLog,
    } of currentIpcHandleChannel) {
      //此ipc仅响应此webContents的ipc消息
      item.webContents.ipc[once ? 'handleOnce' : 'handle'](
        channelName,
        async (e, ...data) => {
          try {
            if (printLog) {
              this.logger.info(
                `触发${channelName}${
                  data?.length > 0 ? `，参数：${JSON.stringify(data)}` : ''
                }`,
              );
            }
            return await this[methodName](e, ...data);
          } catch (error) {
            this.logger.error(error);
            // @ts-ignore
            return { error: error.message };
          }
        },
      );
    }

    //此ipc仅响应此webContents的ipc消息
    item.webContents.ipc.handle(
      EP_SEND_TO_RENDERER_CHANNEL_NAME_EVENT_NAME,
      () => {
        return getWindowIpcSendToRendererChannel(this).map(
          (v) => v.channelName,
        );
      },
    );

    //此ipc仅响应此webContents的ipc消息
    item.webContents.ipc.handle(EP_PARAMS_EVENT_NAME, () => {
      return {
        epWindowName: getProviderName(this),
        epWindowId: this._id,
        epOpenParams: this.openParams,
      };
    });

    //此ipc仅响应此webContents的ipc消息
    item.webContents.ipc.on(EP_READY_EVENT_NAME, async () => {
      await item.webContents.executeJavaScript(
        `
        window.isEpReady = true;
        window.onEpReady && window.onEpReady();
        `,
      );
    });

    await this.loadUrl();
    this.onCreate();
    return this._id;
  }

  /**
   * 加载url
   * @param url
   */
  async loadUrl(url?: string) {
    if (url) {
      this._url = url;
    }
    if (this._currentWindow && this._url) {
      await this._currentWindow.loadURL(this._url);
    }
  }
}
