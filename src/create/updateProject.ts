import fs from 'fs';
import { resolve } from 'path';
import { exec as childProcessExec } from 'child_process';
import { promisify } from 'util';

import { isExists } from '../__utils';

import {
  GIT_USER_NAME_CMD,
  GIT_USER_EMAIL_CMD,
  GIT_REPOSITORY_INIT,
  GIT_REPOSITORY_FIRST_COMMIT,
} from './const';

const exec = promisify(childProcessExec);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/** 通过git获取用户信息 */
const getGitUserInfo = async () => {
  try {
    const result: { name?: string; email?: string } = {};
    // 获取用户名
    const nameRes = await exec(GIT_USER_NAME_CMD);
    if (nameRes) {
      Object.assign(result, { name: nameRes.stdout.replace(`\n`, '') });
    }
    // 获取邮箱
    const emailRes = await exec(GIT_USER_EMAIL_CMD);
    if (nameRes) {
      Object.assign(result, { email: emailRes.stdout.replace(`\n`, '') });
    }
    return result;
  } catch (error) {
    console.error('utopia-scripts: 获取git信息失败');
    console.error(error);
  }
};

type updateProjectParams = {
  path: string;
  prjName: string;
};

type updateProjectFn = (options: updateProjectParams) => Promise<void>;

/** 更新package.json */
const updatePackageJson = async ({
  path,
  prjName,
}: updateProjectParams): Promise<void> => {
  // 更改package.json
  const pkgPath = resolve(path, 'package.json');
  if (!isExists(pkgPath)) return;
  const pkgInfo = await readFile(pkgPath, 'utf8');
  const pkgData = JSON.parse(pkgInfo as string);
  // 修改name
  Object.assign(pkgData, { name: prjName });
  // 修改author
  const userInfo = await getGitUserInfo();
  if (userInfo) {
    const { name, email } = userInfo;
    if (name && email) {
      Object.assign(pkgData, { author: `${name} ${email}` });
    }
  }
  // 写入文件
  await writeFile(pkgPath, JSON.stringify(pkgData, null, 2));
};

/** 初始化git仓库 */
const initGitRepo = async ({ path }: updateProjectParams): Promise<void> => {
  await exec(GIT_REPOSITORY_INIT, { cwd: path });
};

/** 初始化提交 */
const firstCommit = async ({ path }: updateProjectParams): Promise<void> => {
  await exec(GIT_REPOSITORY_FIRST_COMMIT, { cwd: path });
};

/** 更新项目中的部分文件 */
const updateProject: updateProjectFn = async (options) => {
  await Promise.all([
    updatePackageJson(options), // 更新package.json
    initGitRepo(options), // 初始化git仓库
  ]);
  await firstCommit(options);
};

export default updateProject;
