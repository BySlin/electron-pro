import { EpController, EpHandler } from '../decorator';
import { getAllIpcHandleChannel } from '../utils';

@EpController()
export class EpAppController {
  @EpHandler()
  async allIpcHandleChannelName() {
    return getAllIpcHandleChannel().map((v) => v.channelName);
  }
}
