const express = require('express');
const router = express.Router();
const passportFacebook = require('../auth/facebook');

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

module.exports = router;