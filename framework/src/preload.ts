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
    api[windowName][methodName] = (callback: () => void) =>
      ipcRenderer.on(onEventName, callback);
  }
  contextBridge.exposeInMainWorld(apiKey, api);
})();
