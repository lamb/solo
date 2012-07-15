var fs = require('fs');
var md = require("node-markdown").Markdown;
var path = require('path');
var skinPath = './skin/';
var articlePath = './article/';
var mdPath = './md/';

//
if(fs.exists(articlePath)){
  fs.mkdirSync(articlePath);
}
// md目录下的所有文件
var files = fs.readdirSync('md');

var file, dotLastIndex, fileType, fileName;

// 对所有以 .md 为后缀的文件，进行转换
for (var i = 0; i < files.length; i++) {
  file = files[i];
  dotLastIndex = file.lastIndexOf('.');
  if (dotLastIndex >= 0) {
    fileType = file.substr(dotLastIndex + 1);
    if (fileType === 'md') {
      fileName = file.substr(0, dotLastIndex);
      buildFile(file, fileName);
    }
  }
}

// 转换 markdown 文件为html文件
function buildFile(file, fileName) {
  console.log('Build file: ' + file);
  var text = fs.readFileSync(mdPath + file, 'utf8');
  var html = md(text);

  // 替换模板内容
  fileContent = getTemplate('article.html').replace('${article}', html);

  fs.writeFileSync(articlePath + fileName + '.html', fileContent);
}

console.log('Done!');

// 获取皮肤模板文件内容
function getTemplate(fileName) {
  return fs.readFileSync(skinPath + fileName, 'utf8');
}