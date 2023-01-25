import { contextBridge, ipcRenderer } from 'electron';

(async () => {
  const eventNames = (await ipcRenderer.invoke(
    'epAppController@allIpcHandleChannelName',
  )) as string[];
  const onEventNames = (await ipcRenderer.invoke(
    'epAppController@allIpcSendToRendererChannelName',
  )) as string[];
  const apiKey = 'ep';
  const api: any = {
    versions: process.versions,
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
    const removeAllEventMethodName = `removeAll${eventMethodName}`;

    api[windowName][onEventMethodName] = (
      listener: (...args: any[]) => void,
    ) => {
      ipcRenderer[onEventName.includes('once') ? 'once' : 'on'](
        onEventName,
        listener,
      );
    };

    api[windowName][removeEventMethodName] = (
      listener: (...args: any[]) => void,
    ) => {
      ipcRenderer.removeListener(onEventName, listener);
    };

    api[windowName][removeAllEventMethodName] = () => {
      ipcRenderer.removeAllListeners(onEventName);
    };
  }
  contextBridge.exposeInMainWorld(apiKey, api);
})();
