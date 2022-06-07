# !/bin/bash
# --version -v [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]

# 检查工作区是否clean
if [[ -n $(git diff --stat) ]]; then
  echo Error:utopia-scripts error: Git working directory not clean.
  exit 1
fi

# 测试
npm run test

# 升级版本
VERSION="patch"

while [ True ]; do
  if [ "$1" = "--version" -o "$1" = "-v" ]; then
    VERSION=$2
    shift 2
  else
    break
  fi
done

if [ $VERSION ]; then
  echo $VERSION
  npm version $VERSION
fi

# 编译
npm run build

# 部署
npm publish
