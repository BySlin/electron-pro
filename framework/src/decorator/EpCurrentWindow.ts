import { createCustomPropertyDecorator } from '@midwayjs/core';
import { EP_CURRENT_WINDOW_DECORATOR_KEY } from '../constant';

/**
 * currentWindow
 */
export function EpCurrentWindow(): PropertyDecorator {
  return createCustomPropertyDecorator(
    EP_CURRENT_WINDOW_DECORATOR_KEY,
    {},
    false,
  );
}
