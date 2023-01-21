import { contextBridge, ipcRenderer } from "electron";

const apiKey = "electron";

const api: any = {
  versions: process.versions,
  test: () => ipcRenderer.invoke("TestController:test"),
};

contextBridge.exposeInMainWorld(apiKey, api);
