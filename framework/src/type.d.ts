/**
 * EpMessage消息回调
 */
type EpMessageFunction = (
  epWindowParams: { sendWindowId: number },
  ...args: any[]
) => void;

type EpParams = {
  epWindowName: string;
  epWindowId: number;
  epOpenParams: Record<string, any>;
};

type Ep = EpParams & {
  [key: string]: any;
  versions: Record<string, string>;
  ipcRenderer: import('electron').IpcRenderer;
  onEpMessage: (callback: EpMessageFunction) => void;
};

interface Window {
  ep: Ep;
  /**
   * ep加载完成
   */
  isEpReady: boolean;
  /**
   * ep参数加载完成回调
   */
  onEpReady: () => void;
}
