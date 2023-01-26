import { EpController, EpHandler } from '../decorator';
import {
  getAllServiceIpcHandleChannel,
  getAllIpcSendToRendererChannel,
} from '../utils';

@EpController()
export class EpAppController {
  @EpHandler()
  async getAllServiceIpcHandleChannelName() {
    return getAllServiceIpcHandleChannel().map((v) => v.channelName);
  }

  @EpHandler()
  async getAllIpcSendToRendererChannelName() {
    return getAllIpcSendToRendererChannel().map((v) => v.channelName);
  }
}
