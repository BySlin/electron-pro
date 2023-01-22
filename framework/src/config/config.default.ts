import type { EpConfig } from '../interface';
import { MidwayConfig } from '@midwayjs/core';

export default {
  ep: {
    singletonProcess: true,
  } as EpConfig,
} as MidwayConfig;
