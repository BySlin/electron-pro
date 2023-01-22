const { fsExtra, lodash } = require("@umijs/utils");
const path = require("path");
const yargs = require("yargs");
const { pathExistsSync } = require("@umijs/utils/compiled/fs-extra");

/**
 * 打包
 */
function buildDist() {
  const externals = ["electron-pro"];

  const absOutputDir = path.join(process.cwd(), "dist_electron");
  const buildPkg = require("./package.json");
  buildPkg.main = "index.js";

  delete buildPkg.scripts;
  delete buildPkg.devDependencies;

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
  const buildDependencies = [];
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
        config: lodash.merge(defaultBuildConfig),
        ...builderArgs,
      })
    )
    .then(() => {
      console.log("build electron success");
      process.exit();
    });
}

buildDist();
