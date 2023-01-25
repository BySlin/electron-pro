interface Window {
  ep: {
    epWindowName: string;
    epWindowId: number;
    epOpenParams: Record<string, any>;
    versions: Record<string, string>;
    ipcRenderer: import('electron').IpcRenderer;
  };

  /**
   * ep参数加载完成
   */
  onEpReady: () => void;
}
