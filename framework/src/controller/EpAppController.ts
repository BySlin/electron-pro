import { IPCController } from '../interface';
import { IPCHandler } from '../decorator';
import { GET_IPC_ALL_EVENT_NAME } from '../constant';

export class EpAppController extends IPCController {
  @IPCHandler()
  async allIpcEvent() {
    return [...this.app.serviceEventMap.keys()].filter(
      (s) => s !== GET_IPC_ALL_EVENT_NAME,
    );
  }
}
