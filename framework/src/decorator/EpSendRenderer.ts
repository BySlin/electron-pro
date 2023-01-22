import { createCustomMethodDecorator } from '@midwayjs/core';
import { EP_SEND_RENDERER_KEY } from '../constant';

/**
 * send ipcRenderer in
 */
export function EpSendRenderer(): MethodDecorator {
  return createCustomMethodDecorator(EP_SEND_RENDERER_KEY, {}, false);
}
