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
  let userId = req.body['entry.id'];
  let commentMessage = 'Very nice!';


  //database.getAuthTokenForUser(userId, (accessToken) => {
    let dummyAccessToken = 'EAAFTi9wvu3kBAFbdaZCu5Cz1uXMFbPmavwwdltWc2GaqaJCxZC7OWIYufiQXTBbMc6NRUZC7PtoaWfq4b3mgvClSYTxbh00uAS57y6e4MwCaIXavMZA3Gy1J3wfsMrnKR9Wzppo0jwTXB5kRZBGTGxgmnU8cZB35tJEVRLRyuvbgVuVZBCt7xWrdl3ncg0ZBV7MDtzmsRgE5ZBkJoyIyKuCcfAaffla18LcwZD';
    graphApi.getLastFeedItemId(userId, dummyAccessToken, (feedItemId) => {
      console.log("Last feed item " + feedItemId);
      graphApi.commentOnFeedItem(feedItemId, dummyAccessToken, commentMessage, (commentId) => {
        console.log("Auto-commented on feed item " + feedItemId);
      });
    });
  //});

  // do stuff with the update
  lastReceivedUpdates.push(req.body);
  res.sendStatus(200);
});

module.exports = router;
