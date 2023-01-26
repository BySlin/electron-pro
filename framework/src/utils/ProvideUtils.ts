import { getProviderId, getProviderName } from '@midwayjs/core';

export const getEpProvideName = (module: any) => {
  return getProviderId(module) || getProviderName(module);
};
