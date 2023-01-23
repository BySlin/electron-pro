import type { EpConfig } from './interface';

export { EpConfiguration as Configuration } from './configuration';

export * from './createProtocol';
export * from './interface';
export * from './decorator';
export * from './constant';
export * from './bootstrap';
export * from './controller';
export * from './utils';
export * from './provide';
export * from './window';
export * from './interface';

declare module '@midwayjs/core/dist/interface' {
  interface MidwayConfig {
    ep?: EpConfig;
  }
}
