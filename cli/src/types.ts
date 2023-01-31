import { IFatherConfig } from "father";
import type { Configuration } from "electron-builder";

export type IElectronPro = {
  buildOptions: Configuration;
};
export type IElectronProConfig = IFatherConfig & {
  electronPro?: IElectronPro;
};
