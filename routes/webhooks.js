const express = require('express');
const router = express.Router();
const database = require('../database');
const graphApi = require('../facebook/graph-api');

let lastReceivedUpdates = [];

router.get('/check', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(lastReceivedUpdates, null, 2));
});

router.get('/facebook', (req, res) => {
  if (
    req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === 'token'
  ) {
    res.send(req.query['hub.challenge']);
  }
  else {
    res.sendStatus(400);
  }
});

router.post('/facebook', (req, res) => {
  let entry = req.body.entry[0];
  let userId = entry.id;
  let changedFields = entry.changed_fields;

  // Add received webhook entry to list.
  lastReceivedUpdates.push(req.body);

  // Auto-comment if it was a feed update.
  if (changedFields.indexOf('feed') > -1) {
    let commentMessage = 'Cool story!';
    database.getAuthTokenForUser(userId, (err, accessToken) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Access token: " + accessToken);
      graphApi.getLastFeedItemId(userId, accessToken, (err, feedItemId) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Last feed item " + feedItemId);
        graphApi.commentOnFeedItem(feedItemId, accessToken, commentMessage, (err, commentId) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("Auto-commented on feed item " + feedItemId);
        });
      });
    });
  }

  res.sendStatus(200);
});

module.exports = router;
