import {
  getClassMetadata,
  getProviderName,
  INJECT_CUSTOM_METHOD,
  listModule,
} from '@midwayjs/core';
import {
  EP_HANDLER_DECORATOR_KEY,
  EP_MAIN_WINDOW_DECORATOR_KEY,
  EP_SERVICE_DECORATOR_KEY,
  EP_WINDOW_DECORATOR_KEY,
  IPC_EVENT_SEPARATOR,
} from '../constant';

/**
 * 获取所有ipcHandle channel通道名称
 */
export const getAllIpcHandleChannel = () => {
  const result: {
    target: any;
    methodName: string;
    channelName: string;
    once: boolean;
    printLog: boolean;
  }[] = [];

  const epServices = [...(listModule(EP_SERVICE_DECORATOR_KEY) || [])];

  for (const epService of epServices) {
    const providerName = getProviderName(epService);
    const classMetadataArray = getClassMetadata(
      INJECT_CUSTOM_METHOD,
      epService,
    ) as { propertyName: string; key: string; metadata: any }[];

    if (classMetadataArray) {
      for (const { propertyName, key, metadata } of classMetadataArray) {
        if (key === EP_HANDLER_DECORATOR_KEY) {
          result.push({
            target: epService,
            methodName: propertyName,
            channelName: `${providerName}${IPC_EVENT_SEPARATOR}${propertyName}`,
            ...metadata,
          });
        }
      }
    }
  }

  return result;
};

/**
 * 获取所有ipcHandle channel通道名称
 */
export const allIpcSendToRendererChannelName = () => {
  const result: {
    target: any;
    methodName: string;
    channelName: string;
    windowPropertyName: string;
    once: boolean;
  }[] = [];

  const epWindows = [
    ...listModule(EP_WINDOW_DECORATOR_KEY),
    ...listModule(EP_MAIN_WINDOW_DECORATOR_KEY),
  ];

  for (const epWindow of epWindows) {
    const classMetadataArray = getClassMetadata(
      INJECT_CUSTOM_METHOD,
      epWindow,
    ) as { propertyName: string; metadata: any }[];

    if (classMetadataArray) {
      for (const { propertyName, metadata } of classMetadataArray) {
        result.push({
          target: epWindow,
          methodName: propertyName,
          channelName: getIpcSendToRendererChannelName(
            epWindow,
            propertyName,
            metadata,
          ),
          ...metadata,
        });
      }
    }
  }
  return result;
};

/**
 * 拼接ipcRenderer send回调名称
 * @param target
 * @param propertyName
 * @param metadata
 */
export const getIpcSendToRendererChannelName = (
  target: any,
  propertyName: string,
  metadata: any,
) => {
  return `${getProviderName(target)}${IPC_EVENT_SEPARATOR}${propertyName}${
    metadata.once ? `${IPC_EVENT_SEPARATOR}once` : ''
  }`;
};
