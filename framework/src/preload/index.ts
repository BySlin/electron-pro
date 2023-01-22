import type { ContextBridge } from 'electron';

export const EpBridge = (contextBridge: ContextBridge) => {
  const apiKey = 'ep';

  const api: any = {
    versions: process.versions,
  };
  console.log(contextBridge);
  contextBridge.exposeInMainWorld(apiKey, api);
};
