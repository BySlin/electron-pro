import { contextBridge, ipcRenderer } from 'electron';

(async () => {
  const eventNames = (await ipcRenderer.invoke(
    'epAppController@getAllServiceIpcHandleChannelName',
  )) as string[];

  const onEventNames = (await ipcRenderer.invoke(
    'epSendToRendererChannelName',
  )) as string[];

  const epParams = (await ipcRenderer.invoke('epParams')) as EpParams;

  const apiKey = 'ep';
  const api: Ep = {
    ...epParams,
    onEpMessage: (listener: (...args: any[]) => void) => {
      const channel = 'epMessage';
      ipcRenderer.removeAllListeners(channel);
      ipcRenderer.on(channel, (_, ...args: any[]) => listener(...args));
    },
    versions: process.versions,
    ipcRenderer,
  };

  for (const eventName of eventNames) {
    const [controllerName, methodName] = eventName.split('@');
    const newControllerName = controllerName.replace('Controller', '');

    if (api[newControllerName] == undefined) {
      api[newControllerName] = {};
    }

    api[newControllerName][methodName] = (...args: any[]) =>
      ipcRenderer.invoke(eventName, ...args);
  }
  for (const onEventName of onEventNames) {
    const [windowName, methodName] = onEventName.split('@');
    if (api[windowName] == undefined) {
      api[windowName] = {};
    }
    const eventMethodName = `${methodName
      .substring(0, 1)
      .toUpperCase()}${methodName.substring(1)}`;
    const onEventMethodName = `on${eventMethodName}`;
    const removeEventMethodName = `remove${eventMethodName}`;

    api[windowName][onEventMethodName] = (
      listener: (...args: any[]) => void,
    ) => {
      ipcRenderer.removeAllListeners(onEventName);
      ipcRenderer[onEventName.includes('once') ? 'once' : 'on'](
        onEventName,
        (_, ...args: any[]) => listener(...args),
      );
    };

    api[windowName][removeEventMethodName] = () => {
      ipcRenderer.removeAllListeners(onEventName);
    };
  }
  contextBridge.exposeInMainWorld(apiKey, api);

  ipcRenderer.send('epReady');
})();
