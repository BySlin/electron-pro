import { Bootstrap } from '@midwayjs/bootstrap';
import { app, protocol } from 'electron';
import { createProtocol } from './createProtocol';

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

  return await Bootstrap.run();
};
