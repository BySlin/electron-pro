import { EpController, EpHandler } from '../decorator';
import { getAllServiceIpcHandleChannel } from '../utils';

@EpController()
export class EpAppController {
  @EpHandler()
  async getAllServiceIpcHandleChannelName() {
    return getAllServiceIpcHandleChannel().map((v) => v.channelName);
  }
}
