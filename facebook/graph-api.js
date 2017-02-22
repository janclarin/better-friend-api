const fbgraph = require('fbgraph');
fbgraph.setVersion('2.8');

// Pass a function as callback, e.g. function(birthday).
function getBirthday(fbUserId, fbUserAccessToken, callback) {
  const requestUrl = fbUserId + '?fields=birthday&access_token=' + fbUserAccessToken;
  fbgraph.get(requestUrl, (err, res) => {
    callback(res.birthday);
  })
}

exports.getBirthday = getBirthday;
