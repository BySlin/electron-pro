/**
 * EpMessage消息回调
 */
type EpMessageFunction = (
  epWindowParams: { sendWindowId: number },
  ...args: any[]
) => void;

interface Window {
  ep: {
    epWindowName: string;
    epWindowId: number;
    epOpenParams: Record<string, any>;
    versions: Record<string, string>;
    ipcRenderer: import('electron').IpcRenderer;
    onEpMessage: (callback: EpMessageFunction) => void;
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
