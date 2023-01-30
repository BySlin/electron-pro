import * as ep from "electron-pro";
import { join } from "path";
import { Configuration, ILifeCycle } from "@midwayjs/core";

@Configuration({
  imports: [ep],
  importConfigs: [join(__dirname, "./config")],
})
export class ContainerLifeCycle implements ILifeCycle {}
