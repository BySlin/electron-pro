import { Bootstrap } from '@midwayjs/bootstrap';
import { app, protocol } from 'electron';
import { createProtocol } from './createProtocol';
import { isDevelopment } from './constant';
import * as path from 'path';

/**
 * 程序入口
 */
export const runApp = async (baseDir?: string) => {
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

  const appDir = isDevelopment ? process.cwd() : process.resourcesPath;
  return await Bootstrap.configure({
    appDir: appDir,
    baseDir:
      baseDir ?? isDevelopment
        ? path.join(appDir, 'dist')
        : path.join(appDir, __dirname.includes('.asar') ? 'app.asar' : 'app'),
  }).run();
};
