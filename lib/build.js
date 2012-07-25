var fs = require('fs');
var md = require("node-markdown").Markdown;
var path = require('path');
var skinPath = '../skin/';
var slotPath = '../skin/slot/';
var mdArticlePath = '../md/article/';
var articlePath = '../article/';
var articleTemplate = skinPath + 'article.html';
var mdPagePath = '../md/page/';
var pagePath = '../';
var pageTemplate = skinPath + 'page.html';
var charset = 'utf8';

build(mdPagePath, pagePath, pageTemplate);
build(mdArticlePath, articlePath, articleTemplate);
console.log('Done!');

function build(from, to, template) {

  //检查是否存在，不存在则创建
  if (fs.exists(to)) {
    fs.mkdirSync(to);
  }

  var files = fs.readdirSync(from);
  var file, dotLastIndex, fileType, fileName;

// 对所有以 .md 为后缀的文件，进行转换
  for (var i = 0; i < files.length; i++) {
    file = files[i];
    dotLastIndex = file.lastIndexOf('.');
    if (dotLastIndex >= 0) {
      fileType = file.substr(dotLastIndex + 1);
      if (fileType === 'md') {
        fileName = file.substr(0, dotLastIndex);
        buildFile(file, fileName, from, to, template);
      }
    }
  }
}

// 转换 markdown 文件为html文件
function buildFile(file, fileName, from, to, template) {
  console.log('Build file: ' + file);
  var text = fs.readFileSync(from + file, charset);
  var html = md(text);
  var content;

  // 替换模板内容
  content = fs.readFileSync(template, charset).replace('${article}', html);

  // 替换slot
  content = includeSlot(content);

  fs.writeFileSync(to + fileName + '.html', content);
}

function includeSlot(content) {
  var slots = fs.readdirSync(slotPath);
  var slot;
  for (var i = 0; i < slots.length; i++) {
    slot = slots[i];
    var slot_text = fs.readFileSync(slotPath + slot, charset);
    content = content.replace('${slot}'.replace('slot', slot), slot_text);
  }
  return content;
}

