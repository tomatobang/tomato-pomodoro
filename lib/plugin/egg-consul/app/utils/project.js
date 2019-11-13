'use strict';

const fs = require('fs');

let name = null;

const projectConfig = process.argv.filter(item => {
  try {
    JSON.parse(item);
  } catch (err) {
    return false;
  }
  return true;
}).map(item => JSON.parse(item));

if (projectConfig.length === 0) {
  throw new Error('获取项目配置信息失败');
}

const projectBaseDir = projectConfig[0].baseDir;

function getProjectName() {
  if (name) {
    return name;
  }
  const packageStr = fs.readFileSync(`${projectBaseDir}/package.json`, { encoding: 'UTF-8' });
  const pkg = JSON.parse(packageStr);
  name = pkg.name;
  return name;
}

module.exports = {
  getProjectName,
};
