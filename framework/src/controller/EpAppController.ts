import { EpController, EpHandler } from '../decorator';
import { getAllIpcHandleChannel, getAllIpcRendererSendChannel } from '../utils';

@EpController()
export class EpAppController {
  @EpHandler()
  async allIpcHandleChannelName() {
    return getAllIpcHandleChannel().map((v) => v.channelName);
  }

  @EpHandler()
  async allIpcRendererSendChannel() {
    return getAllIpcRendererSendChannel().map((v) => v.channelName);
  }
}
