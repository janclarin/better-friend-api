const database = require("../database");

let handleNoUserFound = function(err, users, res){
  if(err){
    return res.status(503).json({
      "errors": [{
        "status": "503",
        "title": "Unknown Error",
        "detail": "Unknown Error"
      }]
    });
  }
  if(users.length == 0){
    return res.status(504).json({
      "errors": [{
        "status": "504",
        "title": "User not found",
        "detail": "User not found"
      }]
    });
  }
};


exports.getUserInfo = function (req, res) {
  let user_id = req.params.user_id;

  database.findUser(user_id, (err, users) => {

    if(err || users.length == 0){
      return handleNoUserFound(err, users, res);
    }

    let user = users[0];
    return res.status(200).json({"data": {
      "id": user.facebookUid,
      "name": user.name,
      "birthday": user.birthday
    }});


  });
};

exports.getBirthdaySettings = function(req, res){
  let user_id = req.params.user_id;

  database.findUser(user_id, (err, users) => {

    if(err || users.length == 0){
      return handleNoUserFound(err, users, res);
    }

    let user = users[0];
    return res.status(200).json({"data": {
      "id": user.facebookUid,
      "name": user.name,
      "birthdaySettings" : {
        "isEnabled" : user.birthdaySettings.isEnabled,
        "useEmoji" : user.birthdaySettings.useEmoji,
        "callByName" : user.birthdaySettings.callByName
      }
    }});


  });
};

exports.updateBirthdaySettings = function(req, res){
  //TODO
};


exports.getEventSettings = function(req, res){
  //TODO
};

exports.updateEventSettings = function(req, res){
  //TODO
};


