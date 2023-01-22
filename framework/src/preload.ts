import { contextBridge, ipcRenderer } from 'electron';

(async () => {
  const eventNames = (await ipcRenderer.invoke(
    'epAppController@allIpcHandleChannelName',
  )) as string[];
  const onEventNames = (await ipcRenderer.invoke(
    'epAppController@allIpcRendererSendChannel',
  )) as string[];
  const apiKey = 'ep';
  const api: any = {
    versions: process.versions,
  };
  for (const eventName of eventNames) {
    const [controllerName, methodName] = eventName.split('@');
    if (api[controllerName] == undefined) {
      api[controllerName] = {};
    }
    api[controllerName][methodName] = (...args: any[]) =>
      ipcRenderer.invoke(eventName, ...args);
  }
  for (const onEventName of onEventNames) {
    const [windowName, methodName] = onEventName.split('@');
    if (api[windowName] == undefined) {
      api[windowName] = {};
    }
    const eventName = `${methodName
      .substring(0, 1)
      .toUpperCase()}${methodName.substring(1)}`;
    const onEventMethodName = `on${eventName}`;
    const offEventMethodName = `off${eventName}`;

    api[windowName][onEventMethodName] = (callback: (...args: any[]) => void) =>
      ipcRenderer.on(onEventName, (e, ...args) => callback(...args));

    api[windowName][offEventMethodName] = (
      callback: (...args: any[]) => void,
    ) => ipcRenderer.off(onEventName, callback);
  }
  contextBridge.exposeInMainWorld(apiKey, api);
})();
