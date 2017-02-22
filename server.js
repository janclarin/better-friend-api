"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const FacebookStrategy = require('passport').Strategy;
const app = express();
const routes = require('./routes/index');
const port = process.env.PORT || 3000;

// Configure json parsing.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

// Set up routes.
app.use('/', routes);

// Start the server.
app.listen(port, () => {
  console.log('Running on localhost:' + port);
});
