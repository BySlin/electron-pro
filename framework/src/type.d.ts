interface Window {
  ep: {
    epWindowName: string;
    epWindowId: number;
    epOpenParams: Record<string, any>;
    versions: Record<string, string>;
    ipcRenderer: import('electron').IpcRenderer;
  };
  /**
   * ep加载完成
   */
  isEpReady: boolean;
  /**
   * ep参数加载完成回调
   */
  onEpReady: () => void;
}
