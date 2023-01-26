import { contextBridge, ipcRenderer } from 'electron';

(async () => {
  const eventNames = (await ipcRenderer.invoke(
    'epAllServiceChannelName',
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

    if (api[controllerName] == undefined) {
      api[controllerName] = {};
    }

    api[controllerName][methodName] = (...args: any[]) =>
      ipcRenderer.invoke(eventName, ...args);
  }

  if (api.ipcRendererEvents == undefined) {
    api.ipcRendererEvents = {};
  }

  for (const onEventName of onEventNames) {
    const [_, methodName] = onEventName.split('@');

    const eventMethodName = `${methodName
      .substring(0, 1)
      .toUpperCase()}${methodName.substring(1)}`;
    const onEventMethodName = `on${eventMethodName}`;
    const removeEventMethodName = `remove${eventMethodName}`;

    api.ipcRendererEvents[onEventMethodName] = (
      listener: (...args: any[]) => void,
    ) => {
      ipcRenderer.removeAllListeners(onEventName);
      ipcRenderer[onEventName.includes('once') ? 'once' : 'on'](
        onEventName,
        (_, ...args: any[]) => listener(...args),
      );
    };

    api.ipcRendererEvents[removeEventMethodName] = () => {
      ipcRenderer.removeAllListeners(onEventName);
    };
  }
  contextBridge.exposeInMainWorld(apiKey, api);

  ipcRenderer.send('epReady');
})();
