const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { exit } = require('process');

const promisify = util.promisify;
const existsSync = promisify(fs.existsSync);
const remove = promisify(fs.rm);

const entryPath = path.join(process.cwd(), 'src/main.ts');
const libPath = path.join(process.cwd(), 'lib');

const build = async () => {
  try {
    // 删除上一次打包文件
    if (existsSync(libPath)) {
      remove(libPath, { force: true, recursive: true });
    }

    await esbuild.build({
      entryPoints: [entryPath],
      outdir: libPath,
      bundle: true,
      format: 'cjs',
      platform: 'node',
      external: ['./node_modules/*', 'commander'],
      color: true,
    });
  } catch (error) {
    console.error('utopia-scripts build error:\r\n');
    console.error(error);
    exit(1);
  }
};

build();
