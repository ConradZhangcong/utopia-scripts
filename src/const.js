const TemplateList = [
  {
    name: "repo",
    type: "list",
    message: "Please choose a template",
    choices: ["basic", "react"],
  },
];

const OverwriteConfig = [
  {
    name: "isOverwrite", // 与返回值对应
    type: "list", // list 类型
    message: "Target directory exists, Please choose an action",
    choices: [
      { name: "Overwrite", value: true },
      { name: "Cancel", value: false },
    ],
  },
];

module.exports = { TemplateList, OverwriteConfig };
