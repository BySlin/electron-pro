import { protocol } from 'electron';
import { URL } from 'url';
import * as path from 'path';
import { isDevelopment } from './App';
import * as process from 'process';

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
