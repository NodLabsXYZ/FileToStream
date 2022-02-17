const express = require('express');
const cors = require('cors');

const fs = require('fs');
const https = require('https');

const Tail = require('tail').Tail;
const SSEChannel = require('sse-pubsub');

const app = express();
app.use(cors());

const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

const credentials = {key: privateKey, cert: certificate};

const httpsServer = https.createServer(credentials, app);

const channel = new SSEChannel();

const tail = new Tail("../log.txt");

tail.on("line", function(data) {
  channel.publish(data.toString(), 'log')
});

tail.on("error", function(error) {
  console.log('ERROR: ', error);
});

app.get('/stream', (req, res) => channel.subscribe(req, res));

httpsServer.listen(8443);
