var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var url = require('url');
var fs = require('fs');

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
    console.log(pathname)
    fs.exists(pathname, function (exists) {
      if (!exists) {
        response.writeHead(404, {
          'Content-Type' : 'text/plain'
        });

        response.write("This request URL " + pathname + " was not found on this server.");
        response.end();
      } else {
        fs.readFile(pathname, "binary", function (err, file) {
          if (err) {
            response.writeHead(500, {
              'Content-Type' : 'text/plain'
            });

            response.end(err);
          } else {
            response.writeHead(200, {
              'Content-Type' : 'text/html'
            });

            response.write(file, "binary");

            response.end();
          }
        });
      }
    });
  }).listen(80);
}