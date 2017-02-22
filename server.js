const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/webhook', (req, res) => {
  res.send('this is the webhook endpoint. try POSTing.');
});

app.post('/webhook', (req, res) => {
  console.log(req.body);
  res.send(200);
});

// Start the server.
app.listen(port, () => {
  console.log("Running on localhost:" + port);
});
