import { EpController, EpHandler } from '../decorator';
import {
  getAllIpcHandleChannel,
  allIpcSendToRendererChannelName,
} from '../utils';

@EpController()
export class EpAppController {
  @EpHandler()
  async allIpcHandleChannelName() {
    return getAllIpcHandleChannel().map((v) => v.channelName);
  }

  @EpHandler()
  async allIpcSendToRendererChannelName() {
    return allIpcSendToRendererChannelName().map((v) => v.channelName);
  }
}
