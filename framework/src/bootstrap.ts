import { Bootstrap } from '@midwayjs/bootstrap';
import { app, Privileges, protocol } from 'electron';
import { createProtocol } from './createProtocol';
import { isDevelopment } from './constant';
import * as path from 'path';

/**
 * 程序入口
 */
export const runApp = async (options?: {
  devBaseDir?: string;
  prodBaseDir?: string;
  privileges?: Privileges;
}) => {
  options = {
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
    },
    ...options,
  };

  const { privileges, devBaseDir, prodBaseDir } = options;

  //注册自定义协议
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'ep',
      privileges,
    },
  ]);
  //等待Electron加载完成
  await app.whenReady();
  //创建自定义协议
  createProtocol('ep');

  const appDir = isDevelopment ? process.cwd() : process.resourcesPath;
  return await Bootstrap.configure({
    appDir: appDir,
    baseDir: isDevelopment
      ? devBaseDir ?? path.join(appDir, 'dist')
      : prodBaseDir ??
        path.join(appDir, __dirname.includes('.asar') ? 'app.asar' : 'app'),
  }).run();
};
