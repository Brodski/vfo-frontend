const express = require('express');
const path = require('path');

const app = express();
const fs = require('fs');
const https = require('https') ;
const http = require('http');
const url = require('url');


app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


if (process.env.NODE_APP_ENV === 'production') {
  console.log('\nWE DOING IT -' + new Date().toLocaleString())
  const privateKey = fs.readFileSync( '/etc/letsencrypt/live/vfo.one/privkey.pem', 'utf8')
  const certificate = fs.readFileSync( '/etc/letsencrypt/live/vfo.one/cert.pem', 'utf8')
  const ca = fs.readFileSync('/etc/letsencrypt/live/vfo.one/chain.pem', 'utf8')
  const credentials = {
    key: privateKey, 
    cert: certificate,
    ca: ca
  }

  https.createServer(credentials, app).listen(443)

  // Redirect http to https
  http.createServer(function (req, res) {
    const redirectedPortNum = 443
    let urlParse = url.parse("http://" + req.headers.host + req.url);
    let redirected = "https://" + urlParse.hostname + ":" + redirectedPortNum + urlParse.path
    
    // console.log("-------------------")
    // console.log(new Date().toLocaleString() + ' - Redirected')
    // console.log(redirected)

    res.writeHead(301, { "Location": redirected });
    res.end();
  }).listen(80);

// else Development
} else {
  app.listen(80);
}