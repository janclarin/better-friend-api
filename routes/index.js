const express = require('express');
const router = express.Router();
const passportFacebook = require('../auth/facebook');

router.get('/auth/facebook', passportFacebook.authenticate('facebook', {
  scope: [
    'manage_pages'
  ]
}));

module.exports = router;