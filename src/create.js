const path = require("path");
const fs = require("fs-extra");
const util = require("util");
// const ora = require("ora");
const Inquirer = require("inquirer");
const downloadGitRepo = require("download-git-repo");

const { OverwriteConfig, TemplateList } = require("./const");

const downloadGitRepoPromise = util.promisify(downloadGitRepo);

function sleep(n) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, n);
  });
}

async function loading(message, fn, ...args) {
  // const spinner = ora(message);
  // spinner.start(); // 开启加载
  try {
    let executeRes = await fn(...args);
    // 加载成功
    // spinner.succeed();
    return executeRes;
  } catch (error) {
    // 加载失败
    // spinner.fail("request fail, refetching");
    await sleep(1000);
    // 重新拉取
    return loading(message, fn, ...args);
  }
}

async function download(target) {
  // 模板下载地址
  const templateUrl = `direct:https://github.com/ConradZhangcong/utopia-template/react`;
  // 调用 downloadGitRepo 方法将对应模板下载到指定目录
  await loading(
    "downloading template, please wait",
    downloadGitRepoPromise,
    templateUrl,
    path.join(process.cwd(), target) // 项目创建位置
  );
}

module.exports = async function (projectName, options) {
  // 工作目录
  const cwd = process.cwd();
  // 目标目录
  const targetDirectory = path.join(cwd, projectName);

  if (fs.existsSync(targetDirectory)) {
    // 目标目录已存在
    if (options.force) {
      await fs.remove(targetDirectory);
    } else {
      const { isOverwrite } = await new Inquirer.prompt(OverwriteConfig);
      // 选择 Cancel
      if (!isOverwrite) {
        console.log("Cancel");
        return;
      } else {
        // 选择 Overwirte ，先删除掉原有重名目录
        console.log("\r\nRemoving");
        await fs.remove(targetDirectory);
      }
    }
  }

  const { repo } = await new Inquirer.prompt(TemplateList);

  // download(projectName);
  downloadGitRepo(
    `direct:https://github.com/ConradZhangcong/utopia-template-react`,
    path.join(process.cwd(), projectName),
    function (err) {
      console.log(err);
    }
  );

  console.log(projectName, options);
};
