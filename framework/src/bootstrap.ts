import { Bootstrap } from '@midwayjs/bootstrap';
import { app, protocol } from 'electron';
import { createProtocol } from './createProtocol';
import { initializeGlobalApplicationContext } from '@midwayjs/core';
import { isDevelopment } from './constant';
import * as path from 'path';

export const runApp = async () => {
  //注册自定义协议
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'app',
      privileges: {
        secure: true,
        standard: true,
        supportFetchAPI: true,
      },
    },
  ]);
  //等待Electron加载完成
  await app.whenReady();
  //创建自定义协议
  createProtocol('app');
  if (isDevelopment) {
    return await initializeGlobalApplicationContext({
      baseDir: path.join(process.cwd(), 'dist'),
    });
  }
  return await Bootstrap.run();
};
