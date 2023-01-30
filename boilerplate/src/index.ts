import {
  BaseGenerator,
  fsExtra,
  installWithNpmClient,
  prompts,
  yParser,
} from "@umijs/utils";
import { join } from "path";

export default async ({
  cwd,
  args,
}: {
  cwd: string;
  args: yParser.Arguments;
}) => {
  const [name] = args._;
  const target = name ? join(cwd, name) : cwd;
  const registry = "https://registry.npmjs.org/";
  const { version } = require("../package.json");
  const { npmClient } = await prompts(
    [
      {
        type: "select",
        name: "npmClient",
        message: "Pick NPM client",
        choices: [
          { title: "npm", value: "npm" },
          { title: "cnpm", value: "cnpm" },
          { title: "tnpm", value: "tnpm" },
          { title: "yarn", value: "yarn" },
          { title: "pnpm", value: "pnpm" },
        ],
        initial: 3,
      },
    ],
    {
      onCancel() {
        process.exit(1);
      },
    }
  );
  const platform = "node";

  const isNode = platform === "node";
  const generator = new BaseGenerator({
    path: join(__dirname, "../template"),
    target,
    data: {
      version: version.includes("-canary.") ? version : `^${version}`,
      npmClient,
      isNode,
      registry,
    },
    questions: [
      {
        name: "name",
        type: "text",
        message: `Input NPM package name`,
      },
      {
        name: "description",
        type: "text",
        message: `Input NPM package description`,
      },
      {
        name: "author",
        type: "text",
        message: `Input NPM package author (Name <email@example.com>)`,
      },
    ],
  });
  await generator.run();
  // install
  installWithNpmClient({ npmClient, cwd: target });
};
