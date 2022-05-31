import { resolve } from 'path';

/** 判断目录参数是否为数组 */
const isArray = (directory) => /^\[.*\]$/.test(directory);

/** 获取需要处理的目录绝对路径集合 */
const getDirectoryList = (directory) => {
  const baseUrl = process.cwd();
  if (!directory) {
    return [baseUrl];
  }

  if (isArray(directory)) {
    const directoryList = JSON.parse(directory);
    return directoryList.map((dir) => resolve(baseUrl, dir));
  }

  return [];
};

export default getDirectoryList;
