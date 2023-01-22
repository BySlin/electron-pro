import { contextBridge, ipcRenderer } from "electron";

(async () => {
  const eventNames = (await ipcRenderer.invoke(
    "EpAppController@allIpcEvent"
  )) as string[];

  const apiKey = "ep";
  const api: any = {
    versions: process.versions,
  };

  for (const eventName of eventNames) {
    api[eventName] = (...args: any[]) => ipcRenderer.invoke(eventName, args);
  }

  contextBridge.exposeInMainWorld(apiKey, api);
})();
