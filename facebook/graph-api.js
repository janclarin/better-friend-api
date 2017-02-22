const fbgraph = require('fbgraph');
fbgraph.setVersion('2.8');

// Pass a function as callback, e.g. function(birthday).
function getBirthday(userId, userAccessToken, callback) {
  const requestUrl = userId + '?fields=birthday&access_token=' + userAccessToken;
  fbgraph.get(requestUrl, (err, res) => {
    callback(res.birthday);
  });
}

function getFeedItem(feedItemId, userAccessToken, callback) {
  fbgraph.get(feedItemId + '?access_token=' + userAccessToken, (err, res) => {
    callback(err, res);
  });
}

function getFeedItemUserName(feedItemId, userAccessToken, callback) {
  const userId = feedItemId.split('_')[0];
  fbgraph.get(userId + '?access_token=' + userAccessToken, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    callback(err, res.name);
  });
}

function getLastFeedItemId(userId, userAccessToken, callback) {
  console.log("Getting last feed item with access token: " + userAccessToken);
  fbgraph.get(userId + '/feed?limit=1&access_token=' + userAccessToken, (err, res) => {
    const lastFeedItemId = res.data[0].id;
    callback(err, lastFeedItemId);
  });
}

function commentOnFeedItem(feedItemId, userAccessToken, comment, callback) {
  const postUrl = feedItemId + '/comments?access_token=' + userAccessToken + '&message=' + comment;
  fbgraph.post(postUrl, (err, res) => {
    const newCommentId = res.id;
    callback(err, newCommentId);
  });
}

exports.getBirthday = getBirthday;
exports.getFeedItem = getFeedItem;
exports.getFeedItemUserName = getFeedItemUserName;
exports.getLastFeedItemId = getLastFeedItemId;
exports.commentOnFeedItem = commentOnFeedItem;
