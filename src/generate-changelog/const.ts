/** 分割commit meesage的标记 */
export const SPLIT_STR = '--utopia-scripts-split--';

/** 接收到的参数集合类型 */
export interface OptionsType {
  directory?: string;
  since?: string;
  until?: string;
  message?: string;
}

/** 处理后的参数集合类型 */
export interface HandledOptionsType {
  directory?: string;
  directoryList: string[];
  since: string;
  until: string;
  message?: string;
  now: Date;
}

export interface GitCommitItem {
  commitId: string;
  author: string;
  date: string;
  message: string;
}
