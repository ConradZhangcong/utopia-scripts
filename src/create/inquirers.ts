import { prompt } from 'inquirer';
import * as chalk from 'chalk';

/** 要求输入新的项目名称 */
export const inputNewPrjName = (): Promise<{
  prjName: string;
}> =>
  prompt({
    type: 'input',
    name: 'prjName',
    message: 'Target directory exists, please input new project name: ',
  });

/** 确认是否覆盖原目录 */
export const confirmOverwrite = (
  projectName: string,
): Promise<{
  isOverwrite: boolean;
}> =>
  prompt({
    type: 'confirm',
    name: 'isOverwrite',
    message: `Sure to overwrite: ${chalk.red(projectName)} ?`,
  });

/** 项目名冲突时的操作 */
export const operateWhilePrjNameConflict = (): Promise<{
  conflictAction: 'newFolder' | 'overwrite' | 'quit';
}> =>
  prompt<{
    conflictAction: 'newFolder' | 'overwrite' | 'quit';
  }>({
    type: 'list',
    name: 'conflictAction',
    message: 'Target directory exists, Please choose an action',
    choices: [
      { name: 'Create a new floder', value: 'newFolder' },
      { name: 'Overwrite', value: 'overwrite' },
      { name: 'Quit', value: 'quit' },
    ],
  });

/** 选择需要下载的模板 */
export const chooseTemplate = (): Promise<{
  template: 'basic' | 'react';
}> =>
  prompt({
    type: 'list',
    name: 'template',
    message: 'Please choose a template',
    choices: ['basic', 'react'],
  });
