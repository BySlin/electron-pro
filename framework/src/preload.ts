import { contextBridge, ipcRenderer } from 'electron';

(async () => {
  const eventNames = (await ipcRenderer.invoke(
    'epAllServiceChannelName',
  )) as string[];

  const currentWindowEventNames = (await ipcRenderer.invoke(
    'epSendToRendererChannelName',
  )) as string[];

  const onEventNames = (await ipcRenderer.invoke(
    'epSendToRendererChannelName',
  )) as string[];

  const epParams = (await ipcRenderer.invoke('epParams')) as EpParams;

  const apiKey = 'ep';
  const api: Ep = {
    onEpMessage: (listener: (...args: any[]) => void) => {
      const channel = 'epMessage';
      ipcRenderer.removeAllListeners(channel);
      ipcRenderer.on(channel, (_, ...args: any[]) => listener(...args));
    },
    versions: process.versions,
    ipcRenderer,
    currentWindow: {
      ...epParams,
    },
  };

  //注册全局的ipc handle
  for (const eventName of eventNames) {
    const [controllerName, methodName] = eventName.split('@');
    if (api[controllerName] == undefined) {
      api[controllerName] = {};
    }
    api[controllerName][methodName] = (...args: any[]) =>
      ipcRenderer.invoke(eventName, ...args);
  }

  //注册当前window的ipc handle
  for (const eventName of currentWindowEventNames) {
    const [_, methodName] = eventName.split('@');
    api.currentWindow[methodName] = (...args: any[]) =>
      ipcRenderer.invoke(eventName, ...args);
  }

  //注册当前window的ipcRenderer on回调事件
  for (const onEventName of onEventNames) {
    const [_, methodName] = onEventName.split('@');

    const eventMethodName = `${methodName
      .substring(0, 1)
      .toUpperCase()}${methodName.substring(1)}`;
    const onEventMethodName = `on${eventMethodName}`;
    const removeEventMethodName = `remove${eventMethodName}`;

    api.currentWindow[onEventMethodName] = (
      listener: (...args: any[]) => void,
    ) => {
      ipcRenderer.removeAllListeners(onEventName);
      ipcRenderer[onEventName.includes('once') ? 'once' : 'on'](
        onEventName,
        (_, ...args: any[]) => listener(...args),
      );
    };

    api.currentWindow[removeEventMethodName] = () => {
      ipcRenderer.removeAllListeners(onEventName);
    };
  }
  contextBridge.exposeInMainWorld(apiKey, api);

  ipcRenderer.send('epReady');
})();
