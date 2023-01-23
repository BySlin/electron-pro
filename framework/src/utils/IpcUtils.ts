import {
  getClassMetadata,
  getProviderName,
  INJECT_CUSTOM_METHOD,
  listModule,
} from '@midwayjs/core';
import {
  EP_CONTROLLER_DECORATOR_KEY,
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

  const epControllers = [
    ...listModule(EP_CONTROLLER_DECORATOR_KEY),
    ...listModule(EP_SERVICE_DECORATOR_KEY),
    ...listModule(EP_WINDOW_DECORATOR_KEY),
    ...listModule(EP_MAIN_WINDOW_DECORATOR_KEY),
  ];

  for (const epController of epControllers) {
    const providerName = getProviderName(epController);
    const classMetadataArray = getClassMetadata(
      INJECT_CUSTOM_METHOD,
      epController,
    ) as { propertyName: string; key: string; metadata: any }[];

    if (classMetadataArray) {
      for (const { propertyName, key, metadata } of classMetadataArray) {
        if (key === EP_HANDLER_DECORATOR_KEY) {
          result.push({
            target: epController,
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
export const getAllIpcRendererSendChannel = () => {
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
          channelName: getIpcRendererSendChannelName(
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
export const getIpcRendererSendChannelName = (
  target: any,
  propertyName: string,
  metadata: any,
) => {
  return `${getProviderName(target)}${IPC_EVENT_SEPARATOR}${propertyName}${
    metadata.once ? `${IPC_EVENT_SEPARATOR}once` : ''
  }`;
};
