interface Window {
  ep: {
    versions: Record<string, string>;
    ipcRenderer: import('electron').IpcRenderer;
  };
}
