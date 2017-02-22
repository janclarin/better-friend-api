const express = require('express');
const router = express.Router();
const database = require('../database');
const graphApi = require('../facebook/graph-api');

let lastReceivedUpdates = [];
let lastRepliedToFeedIds = [];

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

  // Auto-comment if it was a feed update and if they should reply.
  if (changedFields.indexOf('feed') > -1) {
    shouldAutoReplyToFeed(userId, (err, shouldAutoReply) => {
      if (shouldAutoReply) {
        replyToUserLastFeedItem(userId);
      }
    });
  }

  res.sendStatus(200);
});

function shouldAutoReplyToFeed(userId, callback) {
  database.findUser(userId, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    const birthdaySettings = res[0].birthdaySettings;
    console.log('bday:' + birthdaySettings);
    callback(err, birthdaySettings.isEnabled);
  });
}

function getRandomResponse() {
  const responses = [
    'Cool story!', 'Neat!', 'Lol, so true.', 'Thanks for sharing!',
    'Wow, I was just about to send to you!', 'That is SO cool!'
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function isHappyBirthdayMessage(message) {
  const lowerCasedMessage = message.toLowerCase();
  return lowerCasedMessage.includes('happy') || lowerCasedMessage.includes('birthday');
}

function addToLastRepliedToFeedIds(feedId) {
  if (lastRepliedToFeedIds.length > 5) {
    lastRepliedToFeedIds.shift();
  }
  lastRepliedToFeedIds.push(feedId);
}

function wasRepliedTo(feedId) {
  return lastRepliedToFeedIds.indexOf(feedId) > -1;
}

function replyToUserLastFeedItem(userId) {
  database.getAuthTokenForUser(userId, (err, accessToken) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Access token: " + accessToken);

    // Get last feed item id.
    graphApi.getLastFeedItemId(userId, accessToken, (err, feedItemId) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Last feed item " + feedItemId);

      if (!wasRepliedTo(feedItemId)) {
        // Get last feed item to check if birthday message.
        graphApi.getFeedItem(feedItemId, accessToken, (err, feedItem) => {
          if (err) {
            console.log(err);
            return;
          }

          // Add feed item to replied to list.
          addToLastRepliedToFeedIds(feedItemId);

          const feedItemUserFirstName = feedItem.from.name.split(' ')[0];
          const feedItemMessage = feedItem.message;
          const responseMessage = isHappyBirthdayMessage(feedItemMessage)
            ? 'Thank you, ' + feedItemUserFirstName + '!'
            : getRandomResponse() ;

          graphApi.commentOnFeedItem(feedItemId, accessToken, responseMessage, (err, commentId) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log("Auto-commented on feed item " + feedItemId);
          });
        });
      }
    });
  });
}

module.exports = router;
