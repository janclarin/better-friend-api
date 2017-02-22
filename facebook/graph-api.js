const fbgraph = require('fbgraph');
fbgraph.setVersion('2.8');

// Pass a function as callback, e.g. function(birthday).
function getBirthday(userId, accessToken, callback) {
  const requestUrl = userId + '?fields=birthday&access_token=' + accessToken;
  fbgraph.get(requestUrl, (err, res) => {
    callback(res.birthday);
  });
}

function getFeedItem(feedItemId, accessToken, callback) {
  fbgraph.get(feedItemId + '?fields=from,message&access_token=' + accessToken, (err, res) => {
    callback(err, res);
  });
}

function getLastFeedItemId(userId, accessToken, callback) {
  console.log("Getting last feed item with access token: " + accessToken);
  fbgraph.get(userId + '/feed?limit=1&access_token=' + accessToken, (err, res) => {
    const lastFeedItemId = res.data[0].id;
    callback(err, lastFeedItemId);
  });
}

function commentOnFeedItem(feedItemId, accessToken, comment, callback) {
  const postUrl = feedItemId + '/comments?access_token=' + accessToken + '&message=' + comment;
  fbgraph.post(postUrl, (err, res) => {
    const newCommentId = res.id;
    callback(err, newCommentId);
  });
}

function getPageAccessToken(pageId, userAccessToken, callback) {
  const getUrl = pageId + '?fields=access_token&access_token=' + userAccessToken;
  fbgraph.get(getUrl, (err, res) => {
    callback(err, res.access_token);
  });
}

exports.getBirthday = getBirthday;
exports.getFeedItem = getFeedItem;
exports.getLastFeedItemId = getLastFeedItemId;
exports.commentOnFeedItem = commentOnFeedItem;
exports.getPageAccessToken = getPageAccessToken;
