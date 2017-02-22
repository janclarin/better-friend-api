const database = require("../database");

exports.getUserInfo = function (req, res) {
  let user_id = req.params.user_id;

  database.findUser(user_id, (err, users) => {

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

    let user = users[0];
    return res.status(200).json({"data": {
      "id": user.facebookUid,
      //"birthday" : user.birthday,
      "name": user.name
    }});


  });
};

exports.getBirthdaySettings = function(req, res){
  //TODO
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


