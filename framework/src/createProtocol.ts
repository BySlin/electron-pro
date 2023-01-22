import { protocol } from 'electron';
import { URL } from 'url';
import { isDevelopment } from './constant';
import * as path from 'path';

export const createProtocol = (scheme: string) => {
  protocol.registerFileProtocol(scheme, (request, respond) => {
    let pathName = new URL(request.url).pathname;
    pathName = decodeURI(pathName); // Needed in case URL contains spaces

    const filePath = path.join(
      isDevelopment
        ? process.cwd()
        : path.join(
            process.resourcesPath,
            __dirname.includes('.asar') ? 'app.asar' : 'app',
          ),
      pathName,
    );
    respond({ path: filePath });
  });
};
