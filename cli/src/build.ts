import process from "process";
import { fsExtra, lodash } from "@umijs/utils";
import * as path from "path";
import yargs from "yargs";
import { IOpts } from "./interface";

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

let epConfig: any;

try {
  epConfig = require(path.join(process.cwd(), "epConfig.js"));
} catch {
  epConfig = {};
}

const { run } = require("father/dist/cli/cli");

/**
 * 打包
 */
function buildDist() {
  const externals = ["electron-pro"];

  const absOutputDir = path.join(process.cwd(), "dist_electron");
  const buildPkg = require(path.join(process.cwd(), "package.json"));
  buildPkg.main = "index.js";

  delete buildPkg["scripts"];
  delete buildPkg["devDependencies"];

  //删除不需要的依赖
  Object.keys(buildPkg.dependencies).forEach((dependency) => {
    if (!externals.includes(dependency)) {
      delete buildPkg.dependencies[dependency];
    }
  });

  externals.forEach((external) => {
    if (!buildPkg.dependencies[external]) {
      buildPkg.dependencies[external] = require(path.join(
        process.cwd(),
        "node_modules",
        external,
        "package.json"
      ))?.version;
    }
  });

  //处理内置依赖
  const buildDependencies: string[] = [];
  for (const dep of buildDependencies) {
    const depPackageJsonPath = path.join(
      process.cwd(),
      "node_modules",
      dep,
      "package.json"
    );
    if (fsExtra.existsSync(depPackageJsonPath)) {
      buildPkg.dependencies[dep] = require(depPackageJsonPath).version;
    } else {
      buildPkg.dependencies[dep] = require(path.join(
        process.cwd(),
        "node_modules",
        dep,
        "package.json"
      ))?.version;
    }
  }

  fsExtra.ensureDirSync(absOutputDir);

  if (!fsExtra.pathExistsSync(absOutputDir)) {
    fsExtra.mkdirSync(absOutputDir);
  }

  const dest = path.join(absOutputDir, "bundled");

  if (!fsExtra.pathExistsSync(dest)) {
    fsExtra.mkdirSync(dest);
  }

  fsExtra.ensureDirSync(dest);
  fsExtra.ensureDirSync(path.join(process.cwd(), "win-unpacked"));

  fsExtra.writeFileSync(
    `${absOutputDir}/bundled/package.json`,
    JSON.stringify(buildPkg, null, 2)
  );

  fsExtra.copySync(path.join(process.cwd(), "dist"), dest, {
    overwrite: true,
  });

  fsExtra.copySync(path.join(process.cwd(), "html"), path.join(dest, "html"), {
    overwrite: true,
  });

  const defaultBuildConfig = {
    directories: {
      output: absOutputDir,
      app: `${absOutputDir}/bundled`,
    },
    files: ["**"],
    extends: null,
  };

  // 打包electron
  console.log("build electron");
  const { configureBuildCommand } = require("electron-builder/out/builder");
  const builderArgs = yargs
    .command(["build", "*"], "Build", configureBuildCommand)
    .parse(process.argv);
  require("electron-builder")
    .build(
      lodash.merge({
        config: lodash.merge(defaultBuildConfig, epConfig.buildOptions ?? {}),
        ...builderArgs,
      })
    )
    .then(() => {
      console.log("build electron success");
      process.exit();
    });
}

export const build = async (_opts?: IOpts) => {
  run(_opts).then(buildDist).catch(console.error);
};
