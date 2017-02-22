const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const router = express.Router();
const database = require("../database.js");

// Facebook app info.
const facebookAppId = process.env.FB_APP_ID || '373335136385913';
const facebookAppSecret = process.env.FB_APP_SECRET || 'c9cb9e46a67253fa8988d1cbd6fc04ce';
const facebookCallbackUrl = process.env.FB_CALLBACK_URL || 'https://betterfriend.herokuapp.com/auth/facebook/callback';

// Configure passport.
passport.use(new FacebookStrategy({
    clientID: facebookAppId,
    clientSecret: facebookAppSecret,
    callbackURL: facebookCallbackUrl
  },
  (accessToken, refreshToken, profile, callback) => {
    database.findOrCreateUser(profile.displayName, profile.id, accessToken, (err, user) => {
      if (err){
        console.log(err);
      }

      return callback(err, profile)
    });
  }
));

module.exports = passport;
