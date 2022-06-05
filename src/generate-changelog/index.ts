import { exit } from 'process';
import * as chalk from 'chalk';

import { isDirectoryExists } from '../__utils/isExists';
import { checkGit, checkGitRepo } from './check';
import { processOptions } from './process';
import generateLog from './generateLog';

import { OptionsType } from './const';

export type generateChangelogType = (options: OptionsType) => Promise<void>;

const generateChangelog: generateChangelogType = async (options) => {
  try {
    // 检查git指令
    await checkGit();
    // 处理参数
    const handledOptions = processOptions(options);
    const notExistsDirList: string[] = []; // 不存在的目录
    const notGitRepoDirList: string[] = []; // 不存在git仓库的目录
    const execDirList: string[] = []; // 需要处理的目录

    for (const directory of handledOptions.directoryList) {
      // 如果目录不存在
      if (!isDirectoryExists(directory)) {
        notExistsDirList.push(directory);
        continue;
      }
      // git仓库不存在
      if (!(await checkGitRepo(directory))) {
        notGitRepoDirList.push(directory);
        continue;
      }
      execDirList.push(directory);
    }
    // 生成CHANGELOG
    if (execDirList.length > 0) {
      const logFilePath = await generateLog(execDirList, handledOptions);
      console.log(
        chalk.blue(`changelog has been generated, open ${logFilePath}!`),
      );
    }
    // 提示错误信息
    if (notExistsDirList.length > 0) {
      const notExistsDirStr = notExistsDirList.join('\r\n');
      const errorMsg = `directory are not exist:\r\n${notExistsDirStr}\r\n`;
      console.log(chalk.red(errorMsg));
    }
    if (notGitRepoDirList.length > 0) {
      const notGitRepoDirStr = notGitRepoDirList.join('\r\n');
      const errorMsg = `not a git repository:\r\n${notGitRepoDirStr}\r\n`;
      console.log(chalk.red(errorMsg));
    }
    // 完成
    console.log(chalk.blue('utopia-scripts: generate changelog done!'));
    exit(0);
  } catch (error) {
    console.error(chalk.red('utopia-scripts: ', error));
    exit(1);
  }
};

export default generateChangelog;
