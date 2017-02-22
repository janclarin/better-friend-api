const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const database = require("../database.js");

// Facebook app info.
const facebookAppInfo = require('../facebook/app-info');
const facebookAppId = facebookAppInfo.appId;
const facebookAppSecret = facebookAppInfo.appSecret;
const facebookCallbackUrl = facebookAppInfo.callUrl;

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
