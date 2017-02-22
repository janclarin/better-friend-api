const fbgraph = require('fbgraph');
fbgraph.setVersion('2.8');

function getBirthday(fbUserId, fbUserAccessToken, callback) {
  const requestUrl = fbUserId + '?fields=birthday&access_token=' + fbUserAccessToken;
  fbgraph.get(requestUrl, (err, res) => {
    console.log(res);
    callback(res);
  })
}

exports.getBirthday = getBirthday;
