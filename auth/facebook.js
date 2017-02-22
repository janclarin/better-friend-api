const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const router = express.Router();

// Facebook app info.
const facebookAppId = process.env.FB_APP_ID || '373335136385913';
const facebookAppSecret = process.env.FB_APP_SECRET || 'c9cb9e46a67253fa8988d1cbd6fc04ce';
const facebookCallbackUrl = process.env.FB_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback';

// Configure passport.
passport.use(new FacebookStrategy({
    clientID: facebookAppId,
    clientSecret: facebookAppSecret,
    callbackURL: facebookCallbackUrl
  },
  (accessToken, refreshToken, profile, callback) => {
    console.log(accessToken);
    console.log(profile);
    return callback(null, null);
  }
));

module.exports = passport;
