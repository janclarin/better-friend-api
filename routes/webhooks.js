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
  let userId = req.body.entry[0].id;
  let commentMessage = 'Very nice!';

  database.findUser(userId, (user) => {
    const accessToken = 'EAAFTi9wvu3kBAM6zvKTHa1DymCAFm24v31hFghPAq8Q9ItT8HBJKaJjcCgtggwDjk2aTf8pVch65FZA8w3oeVX3L0PooOkPUZBaC1MzHOEkGwX9otZBmsdeLFQ7oZAXgUu9NzZBtXBMlturCXSAMma1vgOvy9JjshP7gJ22lyzogcal9nMJ4O3XeZBAparfDI4EMyyLdWTDsa9FBCrJBnvUBPqf01u6nYZD'';
    console.log("Access token: " + accessToken);
    graphApi.getLastFeedItemId(userId, accessToken, (feedItemId) => {
      console.log("Last feed item " + feedItemId);
      graphApi.commentOnFeedItem(feedItemId, accessToken, commentMessage, (commentId) => {
        console.log("Auto-commented on feed item " + feedItemId);
      });
    });
  });

  // do stuff with the update
  lastReceivedUpdates.push(req.body);
  res.sendStatus(200);
});

module.exports = router;
