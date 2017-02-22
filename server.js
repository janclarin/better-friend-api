const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

let receivedUpdates = 0;

app.get('/', (req, res) => {
  res.send('hello world test');
});

app.get('/facebook', (req, res) => {
  if (
    req.query.hub.mode === 'subscribe' &&
    req.query.hub.verify_token === 'token'
  ) {
    res.sendStatus(req.query.hub.challenge);
  }
  else {
    res.sendStatus(400);
  }
});

app.post('/facebook', (req, res) => {
  // do stuff with the update
  receivedUpdates += 1;
  console.log(receivedUpdates);
  console.log(req.body);
  res.sendStatus(200);
});

// Start the server.
app.listen(port, () => {
  console.log("Running on localhost:" + port);
});
