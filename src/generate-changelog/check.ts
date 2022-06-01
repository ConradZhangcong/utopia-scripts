import * as child_process from 'child_process';
import { promisify } from 'util';

const exec = promisify(child_process.exec);

/** 检查git指令是否可用 */
export const checkGit = (): Promise<unknown> =>
  exec('git --version').catch(() => {
    throw new Error('command not found: git');
  });

/** 检查git仓库是否存在 */
export const checkGitRepo = (path: string): Promise<boolean> =>
  exec('git rev-parse --is-inside-work-tree', { cwd: path })
    .then((data) => {
      if (data.stdout.includes('true')) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      throw err;
    });
