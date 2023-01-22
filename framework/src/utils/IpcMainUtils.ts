import {
  getClassMetadata,
  getProviderName,
  INJECT_CUSTOM_METHOD,
  listModule,
} from '@midwayjs/core';
import { EP_CONTROLLER_DECORATOR_KEY, IPC_EVENT_SEPARATOR } from '../constant';

/**
 * 获取所有ipcHandle channel通道名称
 */
export const getAllIpcHandleChannel = () => {
  const result: {
    target: any;
    methodName: string;
    channelName: string;
    once: boolean;
  }[] = [];

  const epControllers = listModule(EP_CONTROLLER_DECORATOR_KEY);

  for (const epController of epControllers) {
    const providerName = getProviderName(epController);
    const classMetadataArray = getClassMetadata(
      INJECT_CUSTOM_METHOD,
      epController,
    ) as { propertyName: string; metadata: any }[];

    for (const { propertyName, metadata } of classMetadataArray) {
      result.push({
        target: epController,
        methodName: propertyName,
        channelName: `${providerName}${IPC_EVENT_SEPARATOR}${propertyName}`,
        once: metadata.once,
      });
    }
  }

  return result;
};
