import { promisify } from 'util';
// @ts-ignore
import * as downloadGitRepo from 'download-git-repo';

const downloadRepo = promisify(downloadGitRepo);

export default downloadRepo;
