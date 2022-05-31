import fs from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

import { SPLIT_STR } from '../const.js';

const writeFile = promisify(fs.writeFile);
const matchRegExp = /commitId: (.*), author: (.*), date: (.*), message: (.*)/;

/** 格式化log生成对象 */
const formatLog = (log) => {
  const result = log.match(matchRegExp);
  const [, commitId, author, date, message] = result;
  return { commitId, author, date, message };
};

/** 匹配查找模板下的提交信息 */
const matchMessage = (message, reg) => {
  console.log(message, reg, typeof message);
  return reg ? message.match(new RegExp(reg))[1] : message;
};

/** 生成md文件字符 */
const generateFileStr = (dirList, reg) => {
  const originData = JSON.stringify(dirList, null, 2);
  const completeList = [];
  let result = `# CHANGELOG\r\n\r\n`;

  for (let dirItem of dirList) {
    let messageStr = '';
    const { dirPath, logList } = dirItem;
    const messageList = logList.map((item) => matchMessage(item.message, reg));
    const messageListSet = new Set(messageList);
    for (let item of messageListSet) {
      messageStr += item;
      messageStr += '\r\n';
    }
    dirItem.messageStr = `## ${dirPath}\r\n\r\n${messageStr}\r\n`;
    completeList.push(...messageList);
  }

  const completeListSet = new Set(completeList);
  let completeMessage = '';
  for (let item of completeListSet) {
    completeMessage += item;
    completeMessage += '\r\n';
  }
  result += `${completeMessage}\r\n`;

  for (let dirItem of dirList) {
    result += dirItem.messageStr;
  }

  result += `### origin data\r\n\r\n\`\`\`json\r\n${originData}\r\n\`\`\`\r\n`;

  return result;
};

/** 生成CHANGELOG文件, 返回生成的文件路径 */
const generateLog = async (gitlogExecMap, { now, message }) => {
  const originList = await Promise.all(gitlogExecMap.values());

  const dirList = [...gitlogExecMap.keys()].map((item) => ({
    dirPath: item,
  }));

  for (let index in originList) {
    const gitlogItem = originList[index];
    if (!gitlogItem.stdout) {
      continue;
    }
    const logList = gitlogItem.stdout
      .split(SPLIT_STR)
      .filter((item) => item)
      .map((item) => formatLog(item));
    dirList[index].logList = logList;
  }

  // 组装数据
  const fileData = generateFileStr(dirList, message);

  // 生成文件
  const fileName = `CHANGELOG-${now.getTime()}.md`;
  await writeFile(fileName, fileData);

  // 返回文件名
  return resolve(process.cwd(), fileName);
};

export default generateLog;
