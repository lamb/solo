var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var url = require('url');
var fs = require('fs');
var path =  require('path');
var mime = require("./lib/mime").types;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function (worker, code, signal) {
    console.log('worker ' + worker.pid + ' died');
  });
} else {
  // Workers can share any TCP connection
  // In this case its a HTTP server
  http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var filename = __dirname + pathname;
    fs.exists(filename, function (exists) {
      if (!exists) {
        write404(__dirname + "/404.html", response);
      } else {
        fs.stat(filename, function (err, stats) {
          if (err) {
            write404(__dirname + "/404.html", response);
          } else {
            if (stats.isDirectory()) {
              fs.readFile(filename + "index.html", "binary", function (err, file) {
                writeFile(200 ,filename + "index.html", response, file);
              });
            } else {
              fs.readFile(filename, "binary", function (err, file) {
                if (err) {
                  write404(__dirname + "/404.html", response);
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

function write404(filename, response){
  fs.readFile(filename, "binary", function (err, file) {
    writeFile(404, filename, response,file);
  });
}

function writeFile(status, filename, response, file){
  var suffix = path.extname(filename);
  suffix = suffix ? suffix.slice(1) : 'unknown';
  var contentType = mime[suffix] || "text/plain";
  response.writeHead(status, {'Content-Type': contentType});
  response.write(file, "binary");
  response.end();
}