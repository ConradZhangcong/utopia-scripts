import { exec as childProcessExec } from 'child_process';
import { writeFile as fsWriteFile } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

import { SPLIT_STR, HandledOptionsType, GitCommitItem } from './const';

const exec = promisify(childProcessExec);
const writeFile = promisify(fsWriteFile);

type GitLogItemType = {
  dirPath: string;
  logList?: GitCommitItem[];
  messageStr?: string;
};

/** 获取commit-message中的字段 */
const matchRegExp = /commitId: (.*), author: (.*), date: (.*), message: (.*)/;

/** 拼接查询git log的语句 */
const getLogCommand = ({ since, until }: HandledOptionsType) => {
  return `git log --date=iso --since="${since}" --until="${until}" --pretty=format:"commitId: %h, author: %aN, date: %ad, message: %s${SPLIT_STR}"`;
};

/** 格式化log生成对象 */
const formatLog = (log: string): GitCommitItem | null => {
  const result = log.match(matchRegExp);
  if (!result) return null;
  const [, commitId, author, date, message] = result;
  return { commitId, author, date, message };
};

/** 匹配查找模板下的提交信息 */
const matchMessage = (
  message: string,
  reg?: string,
): string | null | undefined => {
  return reg ? message.match(new RegExp(reg))?.[1] : message;
};

/** 生成md文件字符 */
const generateFileStr = (
  dirList: GitLogItemType[],
  options: HandledOptionsType,
) => {
  const { message: reg, since, until } = options;
  const originData = JSON.stringify(dirList, null, 2);
  const completeList: string[] = [];
  let result = `# CHANGELOG\r\n\r\n`;
  result += `startTime: ${since}\r\nendTime: ${until}\r\n\r\n`;

  for (const dirItem of dirList) {
    const { dirPath, logList } = dirItem;
    let str = `## ${dirPath}\r\n\r\n`;
    const messageList: string[] = [];
    logList?.forEach((item) => {
      const message = matchMessage(item.message, reg);
      if (message) {
        messageList.push(message);
      }
    });
    const messageListSet = new Set(messageList);
    for (const item of messageListSet) {
      str += `${item}\r\n`;
    }
    if (str) {
      dirItem.messageStr = `${str}\r\n`;
    }
    completeList.push(...messageList);
  }

  const completeListSet = new Set(completeList);
  let completeMessage = '';
  for (const item of completeListSet) {
    completeMessage += item;
    completeMessage += '\r\n';
  }
  result += `${completeMessage}\r\n`;

  for (const dirItem of dirList) {
    result += dirItem.messageStr;
  }

  result += `### origin data\r\n\r\n\`\`\`json\r\n${originData}\r\n\`\`\`\r\n`;

  return result;
};

/** 生成CHANGELOG文件, 返回生成的文件路径 */
const generateLog = async (
  execDirList: string[],
  options: HandledOptionsType,
): Promise<string> => {
  const LOG_COMMAND = getLogCommand(options);

  const gitLogExecList: Promise<{
    stdout: string;
    stderr: string;
  }>[] = [];
  const gitLogList: GitLogItemType[] = [];

  for (const dir of execDirList) {
    gitLogExecList.push(exec(LOG_COMMAND, { cwd: dir }));
    gitLogList.push({ dirPath: dir });
  }

  const originList = await Promise.all(gitLogExecList);

  for (const index in originList) {
    const gitlogItem = originList[index];
    if (!gitlogItem.stdout) {
      continue;
    }
    const logList = gitlogItem.stdout
      .split(SPLIT_STR)
      .map((item) => formatLog(item))
      .filter((item) => !!item);
    gitLogList[index].logList = logList as GitCommitItem[];
  }

  // 组装数据
  const fileData = generateFileStr(gitLogList, options);

  // 生成文件
  const { now } = options;
  const fileName = `CHANGELOG-${now.getTime()}.md`;
  await writeFile(fileName, fileData);

  // 返回文件名
  return resolve(process.cwd(), fileName);
};

export default generateLog;
