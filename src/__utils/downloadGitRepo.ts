import { promisify } from 'util';
// @ts-ignore
import downloadGitRepo from 'download-git-repo';

const downloadRepo = promisify(downloadGitRepo);

export default downloadRepo;
