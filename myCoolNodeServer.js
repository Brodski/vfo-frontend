//
// TODO PM2 for node production
//
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

app.get('/ping', function (req, res) {
 return res.send('pong');
});

  console.log('process.env.NODE_APP_ENV')
  console.log(process.env.NODE_APP_ENV)

if (process.env.NODE_APP_ENV === 'production') {

  console.log('WE DOING IT')

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
  console.log('I assume https is running')

  
  // Redirect http to https
//   http.createServer(function (req, res) {
//     res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
//     res.end();
// }).listen(80);


http.createServer(function (req, res) {
  // res.writeHead(301, { "Location": "http://" + req.headers['host'] + req.url });
  console.log("-------------------")
  console.log("req.headers.host: ", req.headers.host)
  console.log('req.url: ', req.url)
  console.log("http://" + req.headers.host + req.url )
  //let poopy = url.parse(request.url, `http://${request.headers.host}`);

  // https://nodejs.org/api/http.html#http_message_url
  // netstat -tulpn
  let urlParse = url.parse("http://" + req.headers.host + req.url);
  console.log(urlParse)
  let important = "https://" + urlParse.hostname + ":" + 6969 + urlParse.path
  console.log('important')
  console.log(important)
  console.log("\n\n\n\n--------\n\n\n")
  console.log('req.headers')
  console.log(req.headers)

   res.writeHead(301, { "Location": important });
  // res.redirect(301, "http://" + req.headers.host + req.url + ":" + 420);
   res.end();
}).listen(7988);

console.log('I assume http (not s) is running')



} else {
  http.createServer(function (req, res) {
    // res.writeHead(301, { "Location": "http://" + req.headers['host'] + req.url });
    console.log("-------------------")
    console.log("req.headers.host: ", req.headers.host)
    console.log('req.url: ', req.url)
    console.log("http://" + req.headers.host + req.url )
    //let poopy = url.parse(request.url, `http://${request.headers.host}`);

    // https://nodejs.org/api/http.html#http_message_url
    // netstat -tulpn
    let urlParse = url.parse("http://" + req.headers.host + req.url);
    console.log(urlParse)
    let important = "https://" + urlParse.hostname + ":" + 6969 + urlParse.path
    console.log('important')
    console.log(important)
    console.log("\n\n\n\n--------\n\n\n")
    console.log('req.headers')
    console.log(req.headers)

     res.writeHead(301, { "Location": important });
    // res.redirect(301, "http://" + req.headers.host + req.url + ":" + 420);
     res.end();
  }).listen(7988);

  // app.listen(process.env.NODE_APP_PORT_NUM);
  app.listen(4269);
  app.listen(4266);
}