const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs')
const https = require('https') 
const http = require('http');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/ping', function (req, res) {
 return res.send('pong');
});

if (process.env.NODE_APP_ENV === 'production') {
  
  const privateKey = fs.readFileSync( '/etc/letsencrypt/live/customyoutube.com/privkey.pem', 'utf8')
  const certificate = fs.readFileSync( '/etc/letsencrypt/live/customyoutube.com/cert.pem', 'utf8')
  const ca = fs.readFileSync('/etc/letsencrypt/live/customyoutube.com/chain.pem', 'utf8')
  const credentials = {
    key: privateKey, 
    cert: certificate,
    ca: ca
  };
  // const httpsServer = https.createServer(credentials, app)
  // httpsServer.listen(443);
  https.createServer(credentials, app).listen(443)

  // Redirect http to https
  http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);



} else {
  app.listen(process.env.NODE_APP_PORT_NUM);
}