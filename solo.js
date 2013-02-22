var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var url = require('url');
var fs = require('fs');
var path = require('path');
var util = require("./lib/util");

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function (worker, code, signal) {
    console.log('worker ' + worker.pid + ' died');
  });
} else {
  http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    if (pathname.charAt(pathname.length - 1) == "/")pathname += "index.html";
    var filename = __dirname + pathname;
    fs.exists(filename, function (exists) {
      if (!exists) {
        write404(response);
      } else {
        fs.stat(filename, function (err, stats) {
          if (err) {
            write404(response);
          } else {
            if (stats.isDirectory()) {
              write404(response);
            } else {
              fs.readFile(filename, "binary", function (err, file) {
                if (err) {
                  write404(response);
                } else {
                  writeFile(200, filename, response, file);
                }
              });
            }
          }
        });
      }
    });
  }).listen(80);
}

function write404(response) {
  fs.readFile(__dirname + "/404.html", "binary", function (err, file) {
    writeFile(404, __dirname + "/404.html", response, file);
  });
}

function writeFile(status, filename, response, file) {
  var contentType = util.getContentType(filename);
  response.writeHead(status, {'Content-Type' : contentType});
  response.write(file, "binary");
  response.end();
}