"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const FacebookStrategy = require('passport').Strategy;
const app = express();
const routes = require('./routes/index');
const queryRoutes = require('./routes/queries');
const webhookRoutes = require('./routes/webhooks');
const port = process.env.PORT || 3000;
const database = require("./database");
const cors = require('cors')

// Configure json parsing.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use(cors());
// Set up routes.
app.use('/', routes);
app.use('/webhooks', webhookRoutes);

app.use('/query/', queryRoutes);

// Start the server.
app.listen(port, () => {
  console.log('Running on localhost:' + port);
});
