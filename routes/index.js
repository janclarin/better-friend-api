const express = require('express');
const router = express.Router();
const passportFacebook = require('../auth/facebook');

router.get('/auth/facebook', passportFacebook.authenticate('facebook', {
  scope: [
    'public_profile',
    'publish_pages',
    'publish_actions',
    'user_birthday',
    'user_events',
    'user_posts'
  ]
}));

module.exports = router;