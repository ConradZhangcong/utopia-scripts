import { program } from 'commander';
import * as chalk from 'chalk';

import create, { createType } from './create';
import generateChangelog, { generateChangelogType } from './generate-changelog';

const packageInfo = require('../package.json');
const { name, version } = packageInfo;

program
  .name(name)
  .version(version, '-v, -V, --version', `display version for ${name}`)
  .usage(`<command> [option]`);

// #region 创建项目
program
  .command('create <project-name>')
  .description('create a new project with utopia-template')
  .option('-f, --force', 'overwrite target directory if it exists')
  .action((...args) => create(...(args as Parameters<createType>)));
// #endregion

// #region 更新项目
// #endregion

// #region 根据commit message生成changelog
program
  .command('generate-changelog')
  .description('generate changelog by commit message')
  .option(
    '-c, --config <config-file>',
    'if exists, other configs will be ignored',
  )
  .option(
    '-d, --directory <directory-list>',
    'accpet string | Array<string>, search subdirectories of current directory',
  )
  .option('-s, --since <start-time>', 'start time')
  .option('-u, --until <end-time>', 'end time')
  .option('-m, --message <message-regexp>', 'match regexp for actual message')
  .action((...args) =>
    generateChangelog(...(args as Parameters<generateChangelogType>)),
  );
// #endregion

// 监听 --help 指令
program.on('--help', function () {
  console.log(
    `\r\nRun ${chalk.cyan(
      `${name} <command> --help`,
    )} for detailed usage of given command.\r\n`,
  );
});

program.parse(process.argv);
