let http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Hello World! - ' + process.env.NODE_APP_MESSAGE);
}).listen(8081);