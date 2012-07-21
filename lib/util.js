var path = require('path');
var mime = require("./mime").types;
var fs = require('fs');

function getContentType(filename){
  var suffix = path.extname(filename);
  suffix = suffix ? suffix.slice(1) : 'unknown';
  return mime[suffix] || "text/plain";
}

function isFile(file) {
  var stats = fs.statSync(file);
  if (stats.isFile()) {
    return true;
  }
  return false;
}

function inArray(needle, haystack) {
  for (var i = 0; i < haystack.length; i++) {
    if (haystack[i] == needle) {
      return true;
    }
  }
  return false;
}

exports.getContentType = getContentType;
exports.isFile = isFile;
exports.inArray = inArray;