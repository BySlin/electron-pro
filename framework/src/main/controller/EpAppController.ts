import { IPCController } from '../interface';
import { IPCHandler } from '../decorator';

export class EpAppController extends IPCController {
  @IPCHandler()
  async allIpcEvent() {
    return [...this.app.serviceEventMap.keys()].filter(
      (s) => s !== 'EpAppController@allIpcEvent',
    );
  }
}
