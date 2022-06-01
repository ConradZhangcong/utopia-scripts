/** 模板仓库列表 */
const TemplateList = [
  {
    name: 'repo',
    type: 'list',
    message: 'Please choose a template',
    choices: ['basic', 'react'],
  },
];

/** 仓库名重复时的选项 */
const OverwriteConfig = [
  {
    name: 'isOverwrite', // 与返回值对应
    type: 'list', // list 类型
    message: 'Target directory exists, Please choose an action',
    choices: [
      { name: 'Create a new floder', value: 'newFolder' },
      { name: 'Overwrite', value: 'overwrite' },
      { name: 'Quit', value: 'quit' },
    ],
  },
];

/** 仓库重命名是的选项 */
const RenameRepoConfig = [
  {
    name: 'inputNewName',
    type: 'input',
    message: 'Target directory exists, please input new project name: ',
  },
];

/** 模板仓库路径 */
const TEMPLATE_REPO_ROOT = 'github:ConradZhangcong/';

/** 远程模板仓库地址 */
const TemplateRepoOptions = {
  basic: `${TEMPLATE_REPO_ROOT}utopia-template-react`,
  react: `${TEMPLATE_REPO_ROOT}utopia-template-react`,
};

export { TemplateRepoOptions, TemplateList, OverwriteConfig, RenameRepoConfig };
