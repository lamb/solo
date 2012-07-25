var util = require("./util");
var path = require('path');
var fs = require('fs');
var qiniu = require("qiniu");

qiniu.conf.ACCESS_KEY = 'ezbZMkL_2LKi6fCkdVRdvrXch2oazWb3JyzymIhk';
qiniu.conf.SECRET_KEY = 'jQcx25JfeZKfQXjgJdI1wD3e4Nm7IrIAXqDDP6Kl';

var conn = new qiniu.digestauth.Client();
var rs = new qiniu.rs.Service(conn, "test");

var ignore = [".idea", ".git", "bin", "lib", "md", "node_modules", "skin", "test", ".gitignore", "app.js", "package.json", "README.md", "CNAME", ".project"];

var domain = "qiniu.mynah.org";

upload("../");
publish();
put404();

function publish() {
  rs.publish(domain, function (resp) {
    console.log("\n===> publish result: ", resp);
    if (resp.code != 200) {
      return;
    }
  });
}

function upload(dir) {
  var files = fs.readdirSync(dir);
  files.forEach(function (file, index, array) {
    var filePath = dir + file;
    if (!util.inArray(file, ignore)) {
      if (util.isFile(filePath)) {
        putFile(filePath);
      } else {
        upload(filePath + "/");
      }
    }
  });
}

function putFile(file) {
  var key = file.replace("../", "");
  var mimeType = util.getContentType(key);
  rs.putFile(key, mimeType, file, function (resp) {
    console.log("\n===> PutFile result: ", resp);
    if (resp.code != 200) {
      return;
    }
  });
}

function put404(){
  var key = "errno-404";
  var mimeType = "text/html";
  var file = "../404.html"
  rs.putFile(key, mimeType, file, function (resp) {
    console.log("\n===> PutFile result: ", resp);
    if (resp.code != 200) {
      return;
    }
  });
}