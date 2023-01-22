import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { PRELOAD_JS_PATH } from '../constant';

export const createWindow = (
  url: string,
  options: BrowserWindowConstructorOptions = {},
) => {
  options.show = options.show ?? false;
  options.webPreferences = options.webPreferences ?? {};
  options.webPreferences.contextIsolation =
    options.webPreferences.contextIsolation ?? true;
  options.webPreferences.preload =
    options.webPreferences.preload ?? PRELOAD_JS_PATH;

  const win = new BrowserWindow(options);
  win.loadURL(url);
  win.once('ready-to-show', () => {
    win.show();
  });
  return win;
};
