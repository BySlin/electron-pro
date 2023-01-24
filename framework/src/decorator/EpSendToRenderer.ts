import { createCustomMethodDecorator } from '@midwayjs/core';
import { EP_SEND_TO_RENDERER_KEY } from '../constant';

/**
 * send ipcRenderer in
 */
export function EpSendToRenderer(options?: {
  once?: boolean;
}): MethodDecorator {
  options = { once: false, ...options };

  return createCustomMethodDecorator(
    EP_SEND_TO_RENDERER_KEY,
    {
      ...options,
    },
    true,
  );
}
