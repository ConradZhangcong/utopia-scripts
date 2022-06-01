import { resolve } from 'path';
import { HandledOptionsType, OptionsType } from './const';

/** 获取当前时间 YYYY-MM-DD HH:mm:ss */
const getLocaleTime = (date: Date): string => {
  const now = date || new Date();
  return now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
};

/** 判断目录参数是否为数组 */
const isArray = (directory: string) => /^\[.*\]$/.test(directory);

/** 获取需要处理的目录绝对路径集合 */
const getDirectoryList = (directory: string | undefined): string[] => {
  const baseUrl = process.cwd();
  if (!directory) {
    return [baseUrl];
  }

  if (isArray(directory)) {
    const directoryList: string[] = JSON.parse(directory);
    return directoryList.map((dir) => resolve(baseUrl, dir));
  }

  return [];
};

/** 处理接受的参数 */
export const processOptions = (options: OptionsType): HandledOptionsType => {
  const { since, until, directory, ...restOptions } = options;
  const nowDate = new Date();
  // 结束时间默认取当前时间
  const untilTime = until || getLocaleTime(nowDate);
  // 开始时间默认取当前时间的凌晨时间点
  const sinceTime = since || nowDate.toLocaleDateString() + ' ' + '00:00:00';

  const directoryList = getDirectoryList(directory);

  return {
    directory,
    directoryList,
    since: sinceTime,
    until: untilTime,
    now: nowDate,
    ...restOptions,
  };
};
