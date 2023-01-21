import { defineConfig } from 'father';

const isDevelopment = process.env.NODE_ENV === 'development';

export default defineConfig({
  sourcemap: isDevelopment,
  cjs: {
    overrides: {
      // @ts-ignore
      'src/electron': 'node',
    },
  },
  prebundle: {
    deps: [],
  },
});
