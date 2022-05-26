#! /usr/bin/env node

const { program } = require("commander");
const chalk = require("chalk");

const { name, version } = require("../package.json");

program
  .name(name)
  .version(version, "-v, -V, --version", `display version for ${name}`)
  .usage(`<command> [option]`);

program
  .command("create <project-name>")
  .description("create a new project with utopia-template")
  .option("-f, --force", "overwrite target directory if it exists")
  .action((projectName, cmd) => {
    require("../src/create")(projectName, cmd);
  });

program
  .command("config [value]") // config 命令
  .description("inspect and modify the config")
  .option("-g, --get <key>", "get value by key")
  .option("-s, --set <key> <value>", "set option[key] is value")
  .option("-d, --delete <key>", "delete option by key")
  .action((value, keys) => {
    // value 可以取到 [value] 值，keys会获取到命令参数
    console.log(value, keys);
  });

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
