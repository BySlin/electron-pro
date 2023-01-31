import { deepmerge, logger, yParser } from "@umijs/utils";
import { IOpts } from "./interface";
import { runDev } from "./dev";
import { runBuild } from "./build";
import {
  checkLocal,
  checkVersion as checkNodeVersion,
  setNoDeprecation,
  setNodeTitle,
} from "father/dist/cli/node";
import { BUILD_COMMANDS, DEV_COMMAND } from "father/dist/constants";
import { Service } from "father/dist/service/service";
import { IElectronProConfig } from "./types";

export async function run(_opts?: IOpts) {
  checkNodeVersion();
  checkLocal();
  setNodeTitle();
  setNoDeprecation();

  const args =
    _opts?.args ||
    yParser(process.argv.slice(2), {
      alias: {
        version: ["v"],
        help: ["h"],
      },
      boolean: ["version"],
    });
  const command = args._[0];

  if (command === DEV_COMMAND) {
    process.env.NODE_ENV = "development";
  } else if (BUILD_COMMANDS.includes(command)) {
    process.env.NODE_ENV = "production";
  }

  try {
    const service = new Service({
      plugins: [],
    });

    await service.run2({
      name: command,
      args: deepmerge({}, args),
    });

    // handle restart for dev command
    if (command === DEV_COMMAND) {
      async function listener(data: any) {
        if (data?.type === "RESTART") {
          // off self
          process.off("message", listener);

          // restart
          run({ args });
        }
      }

      process.on("message", listener);
      await runDev(service.config as IElectronProConfig);
    } else if (BUILD_COMMANDS.includes(command)) {
      await runBuild(service.config as IElectronProConfig);
    }
  } catch (e: any) {
    logger.error(e);
    process.exit(1);
  }
}
