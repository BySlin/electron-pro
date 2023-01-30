import { yParser } from "@umijs/utils";
import { IOpts } from "./interface";
import { dev } from "./dev";
import { build } from "./build";

export async function run(_opts?: IOpts) {
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

  if (command === "dev") {
    await dev(_opts);
  } else if (command === "build") {
    await build(_opts);
  }
}
