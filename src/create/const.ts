/** 远程模板仓库地址 */
export const TemplateRepos = {
  basic: 'github:ConradZhangcong/utopia-template-basic',
  react: 'github:ConradZhangcong/utopia-template-react',
};

/** 获取git用户名称 */
export const GIT_USER_NAME_CMD = 'git config user.name';
/** 获取git用户邮箱 */
export const GIT_USER_EMAIL_CMD = 'git config user.email';
/** 初始化git仓库 */
export const GIT_REPOSITORY_INIT = 'git init';
/** git仓库初次提交 */
export const GIT_REPOSITORY_FIRST_COMMIT = `git add . && git commit -m "init"`;

/** 接收到的参数集合类型 */
export interface OptionsType {
  force?: boolean;
}
