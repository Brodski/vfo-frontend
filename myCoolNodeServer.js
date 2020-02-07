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
  // netstat -tulpn
  // https Springboot port

  // const httpsServer = https.createServer(credentials, app)
  // httpsServer.listen(443);
  https.createServer(credentials, app).listen(443)
  
  // redirects http on port 8080 to httpS on 8080
  http.createServer(credentials, function (req, res){
    const redirectedPortNum = 8443
    let urlParse = url.parse("http://" + req.headers.host + req.url);
    let redirected = "https://" + urlParse.hostname + ":" + redirectedPortNum + urlParse.path
    
    console.log("-------------------2")
    console.log('redirected')
    console.log(redirected)

    res.writeHead(301, { "Location": redirected });
    res.end();
    // res.writeHead(200)
    // res.end("HI!!!")
  }).listen(8080)


  // Redirect http to https
  http.createServer(function (req, res) {
    const redirectedPortNum = 443
    let urlParse = url.parse("http://" + req.headers.host + req.url);
    let redirected = "https://" + urlParse.hostname + ":" + redirectedPortNum + urlParse.path
    
    console.log("-------------------")
    console.log('redirected')
    console.log(redirected)
    res.writeHead(301, { "Location": redirected });
    res.end();
  }).listen(80);


// Development
} else {
  http.createServer(function (req, res) {
    
    
    let urlParse = url.parse("http://" + req.headers.host + req.url);
    let redirected = "https://" + urlParse.hostname + ":" + 8080 + urlParse.path
    console.log("-------------------")
    console.log('redirected')
    console.log(redirected)

     res.writeHead(301, { "Location": redirected });
     res.end();
  }).listen(7988);

  app.listen(process.env.NODE_APP_PORT_NUM);
  //app.listen(4269);
  //app.listen(4266);
}


// sudo keytool -printcert -file etc/letsencrypt/live/customyoutube.com/cert.pem 

// sudo keytool -import -alias springCert -file /etc/letsencrypt/live/customyoutube.com/cert.pem -keystore keystore.p12 -storepass password
// cp keystore.p12 src/main/resources/keystore.p12
// ..\restApi\moreKeyz brodski@35.223.37.170:/home/cbrodski/restApi/src/main/resources/keystore.p12 .

// keytool -importcert -alias springcert -file /etc/letsencrypt/live/customyoutube.com/cert.pem -keystore keystore.jks -storepass password