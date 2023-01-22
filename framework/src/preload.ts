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
    const eventMethodName = `${methodName
      .substring(0, 1)
      .toUpperCase()}${methodName.substring(1)}`;
    const onEventMethodName = `on${eventMethodName}`;
    const removeEventMethodName = `remove${eventMethodName}`;
    const removeAllEventMethodName = `removeAll${eventMethodName}`;

    api[windowName][onEventMethodName] = (callback: (...args: any[]) => void) =>
      ipcRenderer[onEventName.includes('once') ? 'once' : 'on'](
        onEventName,
        callback,
      );

    api[windowName][removeEventMethodName] = (
      callback: (...args: any[]) => void,
    ) => {
      console.log(onEventName, callback);
      ipcRenderer.removeListener(onEventName, callback);
    };

    api[windowName][removeAllEventMethodName] = () =>
      ipcRenderer.removeAllListeners(onEventName);
  }
  contextBridge.exposeInMainWorld(apiKey, api);
})();
