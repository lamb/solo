var fs = require('fs');
var md = require("node-markdown").Markdown;

var text = fs.readFileSync('./md/test.md', 'utf8');
var html = md(text);

console.log(html);