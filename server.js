const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  console.log(req);
  res.send('hello world test');
});

app.get('/facebook', (req, res) => {
  if (
    req.param('hub.mode') === 'subscribe' &&
    req.param('hub.verify_token') === "token"
  ) {
    res.send(req.param('hub.challenge'));
  }
  else {
    res.send(400);
  }
});

app.post('/facebook', (req, res) => {
  console.log(req.body);
  res.send(200);
});

// Start the server.
app.listen(port, () => {
  console.log("Running on localhost:" + port);
});
