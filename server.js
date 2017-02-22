"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const routes = require('./routes/index');
const webhookRoutes = require('./routes/webhooks');
const port = process.env.PORT || 3000;
const database = require("./database");

// Configure json parsing.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

// Set up routes.
app.use('/', routes);
app.use('/webhooks', webhookRoutes);

// Start the server.
app.listen(port, () => {
  console.log('Running on localhost:' + port);
});
