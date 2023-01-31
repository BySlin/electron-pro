import { IFatherConfig } from "father";
import type { Configuration } from "electron-builder";

export type IElectronPro = {
  output?: string;
  htmlDir?: string;
  buildOptions?: Configuration;
};
export type IElectronProConfig = IFatherConfig & {
  electronPro?: IElectronPro;
};
