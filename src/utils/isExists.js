import { existsSync, statSync } from 'fs';

/** 文件/文件夹是否存在 */
const isExists = (path, options = {}) => {
  // 判断路径是否存在
  const exists = existsSync(path);
  if (!exists) return false;

  // 获取文件信息
  const stats = statSync(path);
  const isFile = stats.isFile();

  // 判断目录/文件是否存在
  const type = options.type || 'file';
  if (type === 'file') {
    return isFile;
  } else if (type === 'directory') {
    return !isFile;
  } else {
    console.warn(
      `isExists options.type: ${type} is not validate, will be seen as 'file'`,
    );
    return isFile;
  }
};

/** 文件是否存在 */
export const isFileExists = (path) => isExists(path, { type: 'file' });

/** 文件是否存在 */
export const isDirectoryExists = (path) =>
  isExists(path, { type: 'directory' });

export default isExists;
