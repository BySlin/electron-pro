import { App } from './App';

/**
 * EPService
 */
export class EPService {
  constructor(public app: App) {
    this.app = app;
  }
}

/**
 * IPC控制器
 */
export class IPCController extends EPService {}
