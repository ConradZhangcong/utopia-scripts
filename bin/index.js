#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';

const { name, version } = {
  name: 'utopia-scripts',
  version: '0.0.4',
};

program
  .name(name)
  .version(version, '-v, -V, --version', `display version for ${name}`)
  .usage(`<command> [option]`);

// #region 创建项目
program
  .command('create <project-name>')
  .description('create a new project with utopia-template')
  .option('-f, --force', 'overwrite target directory if it exists')
  .action((source, destination) => {
    import('../src/create/index.js').then((module) => {
      module.default(source, destination);
    });
  });
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
  .action((source, destination) => {
    import('../src/generate-changelog/index.js').then((module) => {
      module.default(source, destination);
    });
  });
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
