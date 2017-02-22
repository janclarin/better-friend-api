const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const router = express.Router();

// Facebook app info.
const facebookAppId = '373335136385913';
const facebookAppSecret = 'c9cb9e46a67253fa8988d1cbd6fc04ce';
const facebookCallbackUrl = 'http://localhost:3000/auth/facebook/callback';

// Configure passport.
passport.use(new FacebookStrategy({
    clientID: facebookAppId,
    clientSecret: facebookAppSecret,
    callbackURL: facebookCallbackUrl
  },
  (accessToken, refreshToken, profile, callback) => {
    // TODO: Save user info here.
  }
));

module.exports = passport;
