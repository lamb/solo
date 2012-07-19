var fs = require('fs');
var md = require("node-markdown").Markdown;
var path = require('path');
var skinPath = './skin/';
var slotPath = './skin/slot/';
var articlePath = './article/';
var mdPath = './md/';
var charset = 'utf8';

//检查是否存在，不存在则创建
if (fs.exists(articlePath)) {
  fs.mkdirSync(articlePath);
}

// md目录下的所有文件
var files = fs.readdirSync(mdPath);
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
  var text = fs.readFileSync(mdPath + file, charset);
  var html = md(text);
  var fileContent;

  // 替换模板内容
  fileContent = readFile('article.html').replace('${article}', html);

  var slots = fs.readdirSync(slotPath);
  var slot;
  for (var i = 0; i < slots.length; i++) {
    slot = slots[i];
    var slot_text = fs.readFileSync(slotPath + slot, charset);
    console.log(slot_text);
    var slotTag = '${' + slot + '}';
    fileContent.replace('${duoshuo}', slot_text);
    console.log(fileContent);
  }

  fs.writeFileSync(articlePath + fileName + '.html', fileContent);
}

console.log('Done!');

// 获取皮肤模板文件内容
function readFile(fileName) {
  return fs.readFileSync(skinPath + fileName, charset);
}