const express = require('express');
const router = express.Router();
const database = require('../database');
const graphApi = require('../facebook/graph-api');

let lastReceivedUpdates = [];
let lastReceivedUpdatesPages = [];
let lastRepliedToFeedIds = [];

router.get('/check', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(lastReceivedUpdates, null, 2));
});

router.get('/check/pages', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(lastReceivedUpdatesPages, null, 2));
});

// User page webhooks.
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

// Business page webhooks.
router.get('/facebook/pages', (req, res) => {
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

router.post('/facebook/pages', (req, res) => {
  let entry = req.body.entry[0];
  let pageId = entry.id;
  let changedField = entry.changes[0].field;

  // Add received webhook entry to list.
  lastReceivedUpdatesPages.push(req.body);

  if (changedField === 'feed') {
    replyToPageLastFeedItem(pageId);
  }

  res.sendStatus(200);
});

function shouldAutoReplyToFeed(userId, callback) {
  database.findUser(userId, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    if(res.length == 0){
      return callback(err, false)
    }
    const birthdaySettings = res[0].birthdaySettings;
    callback(err, birthdaySettings.isEnabled);
  });
}

function shouldIncludeEmoji(userID, callback) {
  database.findUser(userID, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    if (res.length == 0) {
      return callback(err, false)
    }
    const birthdaySettings = res[0].birthdaySettings;
    callback(err, birthdaySettings.useEmoji);
  });
}

function getRandomUserResponse() {
  const responses = [
    'Cool story!', 'Neat!', 'Lol, so true.', 'Thanks for sharing!',
    'Wow, I was just about to send to you!', 'That is SO cool!', 'Cool beans!'
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function getRandomBusinessResponse() {
  const responses = [
    'Thank you for your kind words.', 'Please message us directly for assistance.',
    'We will be releasing new ones soon!', 'Thanks for sharing.', 'Thank you for your support.',
    'We will do our best to get back to you on that.', 'Your business is important to us.',
    'We hope you enjoyed that :)', 'Thanks for sharing your concern!',
    'Thank you for reaching out!',
    'It’s always important for us to know what our fans would like to see from us in the future.',
    'We are glad you are a fan!'
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function isHappyBirthdayMessage(message) {
  const lowerCasedMessage = message.toLowerCase();
  return lowerCasedMessage.includes('happy') || lowerCasedMessage.includes('birthday');
}

// Maintains a queue of 5 feed ids to prevent multiple responses.
function addToLastRepliedToFeedIds(feedId) {
  if (lastRepliedToFeedIds.length > 5) {
    lastRepliedToFeedIds.shift();
  }
  lastRepliedToFeedIds.push(feedId);
}

// Checks if the feed item id has been replied to already.
function wasRepliedTo(feedId) {
  return lastRepliedToFeedIds.indexOf(feedId) > -1;
}

function randomEmoji(){
  const responses = [
  ':)', '<3', ';)', ':P',
  'XD', ':O'
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// Replies to user posts.
function replyToUserLastFeedItem(userId) {
  database.getAuthTokenForUser(userId, (err, accessToken) => {
    if (err) {
      console.log(err);
      return;
    }

    // Get last feed item id.
    graphApi.getLastFeedItemId(userId, accessToken, (err, feedItemId) => {
      if (err) {
        console.log(err);
        return;
      }

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

          shouldIncludeEmoji(userId, (err, includeEmoji) =>{
            const responseMessage = isHappyBirthdayMessage(feedItemMessage)
              ? 'Thank you, ' + feedItemUserFirstName + '! ' + (includeEmoji ? randomEmoji(): "")
              : getRandomUserResponse();

            graphApi.commentOnFeedItem(feedItemId, accessToken, responseMessage, (err, commentId) => {
              if (err) {
                console.log(err);
              }
            });
          });
        });
      }
    });
  });
}

// Replies to page messages.
function replyToPageLastFeedItem(pageId) {
  // From page id get owner access token.
  const sandraUserId = '112064199317537';
  database.findUser(sandraUserId, (err, res) => {
    const pageOwnerAccessToken = res[0].accessToken;
    graphApi.getPageAccessToken(pageId, pageOwnerAccessToken, (err, pageAccessToken) => {
      graphApi.getLastFeedItemId(pageId, pageAccessToken, (err, feedItemId) => {
        if (err) {
          console.log(err);
          return;
        }

        if (!wasRepliedTo(feedItemId)) {
          // Add feed item to replied to list.
          addToLastRepliedToFeedIds(feedItemId);

          const responseMessage = getRandomBusinessResponse();
          graphApi.likeFeedItem(feedItemId, pageAccessToken, (err) => {});
          graphApi.commentOnFeedItem(feedItemId, pageAccessToken, responseMessage, (err, commentId) => {
            if (err) {
              console.log(err);
            }
          });
        }
      });

    });
  });
}

module.exports = router;
