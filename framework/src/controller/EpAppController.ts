import { EpController, EpHandler } from '../decorator';

@EpController()
export class EpAppController {
  @EpHandler()
  async allIpcEvent() {}
}
