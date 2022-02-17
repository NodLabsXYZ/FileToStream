const express = require('express');
const cors = require('cors');
const TailingReadableStream = require('tailing-stream');
const SSEChannel = require('sse-pubsub');

const app = express();
app.use(cors());

const channel = new SSEChannel();

const stream = TailingReadableStream.createReadStream("~/log.txt", {timeout: 0});
console.log("STREAMING", "../log.txt", stream);

stream.on('data', buffer => {
  console.log("DATA", buffer.toString());
  channel.publish(buffer.toString(), 'log')
});

stream.on('close', () => {
  console.log("close");
});

app.get('/stream', (req, res) => channel.subscribe(req, res));

app.listen(3005);

