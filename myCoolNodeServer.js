const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs')
const https = require('https') 


app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/ping', function (req, res) {
 return res.send('pong');
});

if (process.env.NODE_ENV === 'production') {
  
  const privateKey = fs.readFileSync( '/etc/letsencrypt/live/customyoutube.com/privkey.pem', 'utf8')
  const certificate = fs.readFileSync( '/etc/letsencrypt/live/customyoutube.com/cert.pem', 'utf8')
  const ca = fs.readFileSync('/etc/letsencrypt/live/customyoutube.com/chain.pem', 'utf8')
  const credentials = {
    key: privateKey, 
    cert: certificate,
    ca: ca
  };

  const httpsServer = https.createServer(credentials, app)
  //httpsServer.listen(process.env.NODE_APP_PORT_NUM);
  httpsServer.listen(443);
  
  
} else {
  app.listen(process.env.NODE_APP_PORT_NUM);
}