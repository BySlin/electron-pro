import { defineConfig } from "electron-pro-cli";

export default defineConfig({
  plugins: [require.resolve("electron-pro-cli/dist/plugin.js")],
  cjs: {
    output: "dist",
  },
  electronPro: {
    buildOptions: {},
  },
});
