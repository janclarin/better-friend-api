const express = require('express');
const router = express.Router();

// Facebook app info.
const facebookAppInfo = require('../facebook/app-info');
const facebookAppId = facebookAppInfo.appId;
const facebookDialogCallbackUrl = process.env.FB_DIALOG_CALLBACK || 'http://localhost:3000/dialog/callback';
const dialogRedirectUrl =
  'https://www.facebook.com/dialog/feed?app_id=' + facebookAppId +
  '&display=popup&amp;caption=An%20example%20caption' +
  '&link=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F' +
  '&redirect_uri=' + facebookDialogCallbackUrl;

router.get('/', (req, res) => {
  res.redirect(dialogRedirectUrl);
});

router.get('/callback', (req, res) => {
  res.redirect('dialog-good');
});

module.exports = router;
