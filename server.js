const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

let receivedUpdates = 0;
let lastReceivedUpdates = [];

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(lastReceivedUpdates, null, 2));
});

app.get('/facebook', (req, res) => {
  if (
    req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === 'token'
  ) {
    res.send(req.query['hub.challenge']);
  }
  else {
    res.sendStatus(400);
  }
});

app.post('/facebook', (req, res) => {
  // do stuff with the update
  receivedUpdates += 1;
  lastReceivedUpdates.push(req.body);
  res.sendStatus(200);
});

// Start the server.
app.listen(port, () => {
  console.log("Running on localhost:" + port);
});
