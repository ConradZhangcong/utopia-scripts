const path = require("path");
const fs = require("fs-extra");
const util = require("util");
let ora;
(async () => {
  ora = await import("ora");
})();
// const ora = require("ora");
const Inquirer = require("inquirer");
const downloadGitRepo = require("download-git-repo");

const { sleep, downloadRepo } = require("./utils");
const {
  OverwriteConfig,
  TemplateList,
  TemplateRepoOptions,
  RenameRepoConfig,
} = require("./const");

const downloadGitRepoPromise = util.promisify(downloadGitRepo);

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
  const templateUrl = `utopia-template-react`;
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
  let actualProjectName = projectName;
  // 目标目录
  const targetDirectory = path.join(cwd, projectName);

  // TODO:判断是否为目录, 如果为文件目录则提示
  if (fs.existsSync(targetDirectory)) {
    // 目标目录已存在
    if (options.force) {
      await fs.remove(targetDirectory);
    } else {
      const { isOverwrite } = await new Inquirer.prompt(OverwriteConfig);
      // 选择 Cancel
      if (isOverwrite === "quit") {
        console.log("Quit");
        return;
      } else if (isOverwrite === "overwrite") {
        // 选择 Overwirte ，先删除掉原有重名目录
        console.log("\r\nRemoving");
        await fs.remove(targetDirectory);
      } else if (isOverwrite === "newFolder") {
        const { inputNewName } = await new Inquirer.prompt(RenameRepoConfig);
        actualProjectName = inputNewName;
      }
    }
  }

  const { repo } = await new Inquirer.prompt(TemplateList);

  const spinner = ora.default("downloading template, please wait");
  spinner.start(); // 开启加载

  console.log(repo);
  // download(projectName);
  downloadRepo(
    TemplateRepoOptions[repo],
    path.join(process.cwd(), actualProjectName)
  )
    .then(() => {
      spinner.succeed();
      console.log("done");
    })
    .catch((err) => {
      spinner.fail("request fail, refetching");
      console.log("err: ", err);
    });

  console.log(projectName, options);
};

// 检查目标路径文件是否正确
// 拉取git上的vue+ts+ele的项目模板
// 存放在临时文件夹中
// 把下载下来的资源文件，拷贝到目标文件夹
// 根据用户git信息等，修改项目模板中package.json的一些信息
// 对我们的项目进行git初始化
// 最后安装依赖、启动项目等！
