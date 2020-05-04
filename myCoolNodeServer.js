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
  console.log('WE DOING IT')
  const privateKey = fs.readFileSync( '/etc/letsencrypt/live/customyoutube.com/privkey.pem', 'utf8')
  const certificate = fs.readFileSync( '/etc/letsencrypt/live/customyoutube.com/cert.pem', 'utf8')
  const ca = fs.readFileSync('/etc/letsencrypt/live/customyoutube.com/chain.pem', 'utf8')
  const credentials = {
    key: privateKey, 
    cert: certificate,
    ca: ca
  };
  https.createServer(credentials, app, function (req, res){
    console.log("In here")
    if (req.headers.host === "customyoutube.com"){
      console.log("Redirected")
      let urlParse = url.parse("https://" + req.headers.host + req.url);
      let redirected = "https://videofeedorganizer.com" + urlParse.path
      res.writeHead(301, { "Location": redirected });
      res.end();
    }
  }).listen(443)

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




// http.createServer(function (req, res){
//   if (req.headers.host === "customyoutube.com"){
//     let urlParse = url.parse("https://" + req.headers.host + req.url);
//     let redirected = "https://videofeedorganizer.com" + urlParse.path
//     res.writeHead(301, { "Location": redirected });
//     res.end();
//   }
  
// }).listen(443)
