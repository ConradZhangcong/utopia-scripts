import { exit } from 'process';
import { rm } from 'fs';
import { resolve } from 'path';
import * as ora from 'ora';
import { promisify } from 'util';
import * as chalk from 'chalk';

import { downloadGitRepo } from '../__utils';
import getActualProjectName from './getActualProjectName';
import { chooseTemplate } from './inquirers';

import { TemplateRepos, OptionsType } from './const';

const remove = promisify(rm);

export type createType = (
  projectName: string,
  options: OptionsType,
) => Promise<void>;

/** 根据模板创建项目 */
const create: createType = async (projectName, options) => {
  try {
    const actualPrjNameRes = await getActualProjectName(projectName, options);
    const { quit, projectName: actualPrjName, overwrite } = actualPrjNameRes;
    if (quit) {
      console.log('quit');
      console.log(chalk.blue('utopia-scripts: create done!'));
      exit(0);
    }

    const cwd = process.cwd();
    const actualPath = resolve(cwd, actualPrjName);

    // 删除原文件
    if (overwrite) {
      await remove(actualPath, { force: true, recursive: true });
    }
    // 拷贝项目到目标文件夹
    const { template } = await chooseTemplate();
    const spinner = ora('downloading template, please wait');
    spinner.start(); // 开启加载
    try {
      await downloadGitRepo(TemplateRepos[template], actualPath);
      spinner.succeed();
      console.log('done');
    } catch (err) {
      spinner.fail('request fail, refetching');
      console.log('err: ', err);
    }
  } catch (error) {
    console.error(chalk.red('utopia-scripts: ', error));
    exit(1);
  }
};

// 存放在临时文件夹中
// 把下载下来的资源文件，拷贝到目标文件夹
// 根据用户git信息等，修改项目模板中package.json的一些信息
// 对我们的项目进行git初始化
// 最后安装依赖、启动项目等！

export default create;
