import { createCustomMethodDecorator } from '@midwayjs/core';
import { EP_SEND_RENDERER_KEY } from '../constant';

/**
 * send ipcRenderer in
 */
export function EpSendRenderer(options?: { once?: boolean }): MethodDecorator {
  options = { once: false, ...options };

  return createCustomMethodDecorator(
    EP_SEND_RENDERER_KEY,
    {
      ...options,
    },
    true,
  );
}
