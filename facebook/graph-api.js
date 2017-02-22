const fbgraph = require('fbgraph');
fbgraph.setVersion('2.8');

// Pass a function as callback, e.g. function(birthday).
function getBirthday(userId, userAccessToken, callback) {
  const requestUrl = userId + '?fields=birthday&access_token=' + userAccessToken;
  fbgraph.get(requestUrl, (err, res) => {
    callback(res.birthday);
  });
}

function getLastFeedItemId(userId, userAccessToken, callback) {
  fbgraph.get(userId + '/feed?limit=1&access_token=' + userAccessToken, (err, res) => {
    console.log(res);
    callback(res.data['data'][0].id);
  });
}

function commentOnFeedItem(feedItemId, userAccessToken, comment, callback) {
  const postUrl = feedItemId + '/comments?access_token=' + userAccessToken + '&message=' + comment;
  fbgraph.post(postUrl, (err, res) => {
    const newCommentId = res.id;
    callback(newCommentId);
  });
}

exports.getBirthday = getBirthday;
exports.getLastFeedItemId = getLastFeedItemId;
exports.commentOnFeedItem = commentOnFeedItem;
