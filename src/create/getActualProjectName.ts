import { existsSync } from 'fs';
import { resolve } from 'path';

import {
  inputNewPrjName,
  confirmOverwrite,
  operateWhilePrjNameConflict,
} from './inquirers';

import { OptionsType } from './const';

/** 判断是否存在文件/目录 */
const checkExist = (projectName: string) => {
  const cwd = process.cwd();
  const targetDir = resolve(cwd, projectName);
  return existsSync(targetDir);
};

/** 重新输入文件名直至没有冲突 */
const getNewPrjName = async () => {
  const loop = async () => {
    const answer = await inputNewPrjName();
    return answer.prjName;
  };
  let prjName = await loop();
  while (checkExist(prjName)) {
    prjName = await loop();
  }
  return prjName;
};

/** 目标名称为已存在文件时的吃力 */
const conflict = async (
  projectName: string,
): Promise<
  | {
      quit?: false;
      projectName: string;
      overwrite: boolean;
    }
  | { quit: true; projectName?: never; overwrite?: never }
> => {
  const { conflictAction } = await operateWhilePrjNameConflict();

  if (conflictAction === 'overwrite') {
    const { isOverwrite } = await confirmOverwrite(projectName);
    if (isOverwrite) {
      return { projectName, overwrite: true };
    } else {
      return await conflict(projectName);
    }
  } else if (conflictAction === 'newFolder') {
    const newPrjName = await getNewPrjName();
    return { projectName: newPrjName, overwrite: false };
  } else {
    return {
      quit: true,
    };
  }
};

/** 获取 */
const getActualProjectName = async (
  projectName: string,
  options: OptionsType,
): Promise<
  | {
      quit?: false;
      projectName: string;
      overwrite: boolean;
    }
  | { quit: true; projectName?: never; overwrite?: never }
> => {
  // 参数路径不存在
  if (!checkExist(projectName)) return { projectName, overwrite: false };

  // 参数路径存在
  // 接收到force参数
  if (Reflect.has(options, 'force')) {
    let forceOverwrite = false;
    if (options.force) {
      const ans = await confirmOverwrite(projectName);
      forceOverwrite = ans.isOverwrite;
    }
    // 强制覆盖文件
    if (forceOverwrite) return { projectName, overwrite: true };
    // 要求重新输入文件名直至没有冲突
    const newPrjName = await getNewPrjName();
    return { projectName: newPrjName, overwrite: true };
  }

  // 未接收到force参数
  const confilctRes = conflict(projectName);
  return confilctRes;
};

export default getActualProjectName;
