process.env.NODE_ENV = 'development';

const { chokidar } = require('@umijs/utils');
const { spawn } = require('child_process');
const path = require('path');

const TIMEOUT = 2000;

/**
 * 防抖动，避免方法重复执行
 * @param f 方法
 * @param ms 检测时间
 */
function debounce(f, ms) {
  let isCoolDown = false;
  return () => {
    if (isCoolDown) return;
    f();
    isCoolDown = true;
    setTimeout(() => (isCoolDown = false), ms);
  };
}

/**
 * 以开发模式运行
 */
const runDev = () => {
  const electronPath = require('electron');
  let spawnProcess = null;

  const runMain = debounce(() => {
    if (spawnProcess !== null) {
      spawnProcess.kill('SIGKILL');
      spawnProcess = null;
    }

    spawnProcess = spawn(String(electronPath), [
      `--inspect=5858`,
      path.join(process.cwd(), 'dist', 'cjs', 'main', 'index.js'),
    ]);
    spawnProcess.stdout.on('data', (data) => {
      const log = filterText(data.toString());
      if (log) {
        console.log(log);
      }
    });
    spawnProcess.stderr.on('data', (data) => {
      const log = filterText(data.toString());
      if (log) {
        console.error(log);
      }
    });
    spawnProcess.on('close', (code, signal) => {
      if (signal !== 'SIGKILL') {
        process.exit(-1);
      }
    });

    return spawnProcess;
  }, TIMEOUT);

  const watcher = chokidar.watch([`${path.join(process.cwd(), 'dist')}/**`], {
    ignoreInitial: true,
  });

  watcher
    .on('unlink', () => {
      if (spawnProcess !== null) {
        spawnProcess.kill('SIGINT');
        spawnProcess = null;
      }
    })
    .on('change', () => {
      runMain();
    });

  runMain();
};

/**
 * 过滤electron输出
 */
function filterText(s) {
  const lines = s
    .trim()
    .split(/\r?\n/)
    .filter((it) => {
      // https://github.com/electron/electron/issues/4420
      // this warning can be safely ignored
      if (
        it.includes("Couldn't set selectedTextBackgroundColor from default ()")
      ) {
        return false;
      }
      if (
        it.includes("Use NSWindow's -titlebarAppearsTransparent=YES instead.")
      ) {
        return false;
      }
      if (it.includes('Debugger listening on')) {
        return false;
      }
      return (
        !it.includes(
          'Warning: This is an experimental feature and could change at any time.',
        ) &&
        !it.includes('No type errors found') &&
        !it.includes('webpack: Compiled successfully.')
      );
    });

  if (lines.length === 0) {
    return null;
  }
  return '  ' + lines.join(`\n  `) + '\n';
}

runDev();
