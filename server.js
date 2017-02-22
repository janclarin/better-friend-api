const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const database = require("./database")


app.get('/', (req, res) => {
  res.send('Hello world');
});

// Start the server.
app.listen(port, () => {
  console.log("Running on localhost:" + port);
});
