import { exit } from 'process';
import { rm } from 'fs';
import { resolve } from 'path';
import ora from 'ora';
import { promisify } from 'util';
import { blue as chalkBlue, red as chalkRed } from 'chalk';

import { downloadGitRepo } from '../__utils';
import getActualProjectName from './getActualProjectName';
import updateProject from './updateProject';
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
    // 获取实际的项目名
    const actualPrjNameRes = await getActualProjectName(projectName, options);
    const { quit, projectName: actualPrjName, overwrite } = actualPrjNameRes;
    if (quit) {
      console.log('quit');
      console.log(chalkBlue('utopia-scripts: create done!'));
      exit(0);
    }
    // 拼接项目路径
    const cwd = process.cwd();
    const actualPath = resolve(cwd, actualPrjName);

    // 选择模板
    const { template } = await chooseTemplate();
    // 拷贝项目到目标文件夹
    const spinner = ora('downloading template, please wait');
    spinner.start(); // 开启加载
    try {
      // 删除原文件
      if (overwrite) {
        await remove(actualPath, { force: true, recursive: true });
      }
      // 下载项目到目标文件夹
      await downloadGitRepo(TemplateRepos[template], actualPath);
      // 更新项目中部分文件
      await updateProject({ path: actualPath, prjName: actualPrjName });
      spinner.succeed();
      console.log('done');
    } catch (err) {
      spinner.fail('request fail, refetching');
      console.log('err: ', err);
    }
  } catch (error) {
    console.error(chalkRed('utopia-scripts create error:'));
    console.error(error);
    exit(1);
  }
};

export default create;
