"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@umijs/utils");
const path_1 = require("path");
exports.default = async ({ cwd, args, }) => {
    const [name] = args._;
    const target = name ? (0, path_1.join)(cwd, name) : cwd;
    const registry = "https://registry.npmjs.org/";
    const { version } = require("../package.json");
    const { npmClient } = await (0, utils_1.prompts)([
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
    ], {
        onCancel() {
            process.exit(1);
        },
    });
    const platform = "node";
    const isNode = platform === "node";
    const generator = new utils_1.BaseGenerator({
        path: (0, path_1.join)(__dirname, "../template"),
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
    (0, utils_1.installWithNpmClient)({ npmClient, cwd: target });
};
