const downloadGitRepo = require("download-git-repo");

const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const downloadRepo = (repo, dest) => {
  return new Promise((resolve, reject) => {
    downloadGitRepo(repo, dest, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

module.exports = {
  sleep,
  downloadRepo,
};
