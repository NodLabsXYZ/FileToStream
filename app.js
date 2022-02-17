const express = require('express');
const cors = require('cors');
// const Tail = require('tail').Tail;
const RocketTurtleTail = require('rocket-turtle-tail');
const SSEChannel = require('sse-pubsub');

const app = express();
app.use(cors());

const channel = new SSEChannel();

const tail = new RocketTurtleTail('../log.txt');

tail.on('line', (line) => {
  console.log('OH LOOK, A LINE!', line);
});

tail.on('error', (err) => {
  console.log('Boooooo an error:', err);
});

tail.start();

// const tail = new Tail("../log.txt");

// tail.on("line", function(data) {
//   console.log("Line: " + data);
//   channel.publish(data.toString(), 'log')
// });

// tail.on("error", function(error) {
//   console.log('ERROR: ', error);
// });

// const stream = TailingReadableStream.createReadStream("../log.txt", {timeout: 0});

// stream.on('data', buffer => {
//   channel.publish(buffer.toString(), 'log')
// });

// stream.on('close', () => {
//   console.log("close");
// });

app.get('/stream', (req, res) => channel.subscribe(req, res));

app.listen(3005);

