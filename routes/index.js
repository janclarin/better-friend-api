const express = require('express');
const router = express.Router();
const passportFacebook = require('../auth/facebook');
const path = require('path');
const database = require('../database');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

router.get('/auth/facebook', passportFacebook.authenticate('facebook', {
  scope: [
    'public_profile',
    'publish_pages',
    'publish_actions',
    'rsvp_event',
    'user_birthday',
    'user_events',
    'user_posts',
    'user_status'
  ]
}));

router.get('/auth/facebook/callback',
  passportFacebook.authenticate('facebook', { failureRedirect: 'https://fb-auto.herokuapp.com/login' , session :  false}),
  (req, res) => {
    // Successfully authenticated.
    res.status(200).redirect('https://fb-auto.herokuapp.com/profile/?uid=' + req.user.id);
  }
);

module.exports = router;
