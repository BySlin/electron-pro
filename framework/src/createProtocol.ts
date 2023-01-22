import { protocol } from 'electron';
import { URL } from 'url';
import { isDevelopment } from './constant';
import * as path from 'path';

export const createProtocol = (scheme: string) => {
  protocol.registerFileProtocol(scheme, (request, respond) => {
    let pathName = new URL(request.url).pathname;
    pathName = decodeURI(pathName); // Needed in case URL contains spaces

    const filePath = path.join(
      isDevelopment ? process.cwd() : __dirname,
      pathName,
    );
    respond({ path: filePath });
  });
};
