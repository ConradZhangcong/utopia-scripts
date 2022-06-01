import child_process from 'child_process'; //子进程模块
import { exit } from 'process';
import { promisify } from 'util';
import chalk from 'chalk';

import getDirectoryList from './getDirectoryList.js';
import generateLog from './generateLog.js';
import { isDirectoryExists } from '../utils/isExists.js';
import { getLocaleTime } from '../utils/time.js';
import { SPLIT_STR } from './const.js';

const exec = promisify(child_process.exec);

/** 检查git指令是否可用 */
const checkGit = () =>
  exec('git --version', 'utf8').catch(() => {
    throw new Error('command not found: git');
  });

/** 检查git仓库是否存在 */
const checkGitRepo = (path) =>
  exec('git rev-parse --is-inside-work-tree', { cwd: path })
    .then((data) => {
      if (data.stdout.includes('true')) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      throw err;
    });

/** 处理参数 设置默认参数 */
const processOptions = (options) => {
  const nowDate = new Date();
  // 结束时间默认取当前时间
  const untilTime = options.until || getLocaleTime(nowDate);
  // 开始时间默认取当前时间的凌晨时间点
  const sinceTime =
    options.since || nowDate.toLocaleDateString() + ' ' + '00:00:00';

  return {
    now: nowDate,
    since: sinceTime,
    until: untilTime,
    message: options.message,
  };
};

/** 拼接查询git log的语句 */
const getLogCommand = ({ since, until }) => {
  return `git log --date=iso --since="${since}" --until="${until}" --pretty=format:"commitId: %h, author: %aN, date: %ad, message: %s${SPLIT_STR}"`;
};

const generateChangelog = async (options) => {
  try {
    // 检查git指令
    await checkGit();
    // 获取目录集合
    const directoryList = getDirectoryList(options.directory);
    const notExistsDir = []; // 不存在的目录
    const notGitRepoDir = []; // 不存在git仓库的目录
    const gitlogExecMap = new Map();
    const handledOptions = processOptions(options);
    const LOG_COMMAND = getLogCommand(handledOptions);
    for (let directory of directoryList) {
      // 如果目录不存在
      if (!isDirectoryExists(directory)) {
        notExistsDir.push(directory);
        continue;
      }
      // git仓库不存在
      if (!(await checkGitRepo(directory))) {
        notGitRepoDir.push(directory);
        continue;
      }
      // 查询git log
      gitlogExecMap.set(directory, exec(LOG_COMMAND, { cwd: directory }));
    }
    if (gitlogExecMap.size > 0) {
      const logFilePath = await generateLog(gitlogExecMap, handledOptions);
      console.info(
        chalk.blue(`utopia-scripts: generate changelog, open ${logFilePath}!`),
      );
    }
    // 抛出错误信息
    let errorMsg = '';
    if (notExistsDir.length > 0) {
      const notExistsDirStr = notExistsDir.join('\r\n');
      errorMsg += `directory are not exist:\r\n${notExistsDirStr}\r\n`;
    }
    if (notGitRepoDir.length > 0) {
      const notGitRepoDirStr = notGitRepoDir.join('\r\n');
      errorMsg += `not a git repository:\r\n${notGitRepoDirStr}\r\n`;
    }
    if (errorMsg) {
      console.info(chalk.red(errorMsg));
    }
    // 完成
    console.info(chalk.blue('utopia-scripts: generate changelog done!'));
    exit(0);
  } catch (error) {
    console.error(chalk.red('utopia-scripts: ', error));
    exit(1);
  }
};

export default generateChangelog;
