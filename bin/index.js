#! /usr/bin/env node

import { program } from "commander";
import chalk from "chalk";

import packageInfo from "../utils/importModule.js";

const { name, version } = packageInfo;

program
  .name(name)
  .version(version, "-v, -V, --version", `display version for ${name}`)
  .usage(`<command> [option]`);

// 创建项目
program
  .command("create <project-name>")
  .description("create a new project with utopia-template")
  .option("-f, --force", "overwrite target directory if it exists")
  .action((source, destination) => {
    import("../src/create.js").then((module) => {
      console.log("module: ", module);
      module.default(source, destination);
    });
  });

// 更新项目

// 监听 --help 指令
program.on("--help", function () {
  // 前后两个空行调整格式，更舒适
  console.log(
    `\r\nRun ${chalk.cyan(
      `${name} <command> --help`
    )} for detailed usage of given command.\r\n`
  );
});

program.parse(process.argv);
