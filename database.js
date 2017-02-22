"use strict";
const DATABASE_LOC = 'mongodb://heroku_5b8z7gld:h1h9h3h8bquori1ost3qaeqhn4@ds157469.mlab.com:57469/heroku_5b8z7gld';
const mongoose = require('mongoose');

mongoose.connect(DATABASE_LOC);


let birthdaySchema = mongoose.Schema({
  isEnabled : {type : Boolean, required : true, default : false},
  callByName : {type : Boolean, required : true, default : false},
  useEmoji : {type : Boolean, required : true, default : false}
});

let eventSchema = mongoose.Schema({
  isEnabled : {type : Boolean, required : true, default : false},
  makeExcuse : {type : Boolean, required : true, default : false}
});

let userSchema = mongoose.Schema({
  name: {type : String, required : true},
  facebookUid : {type : String, unique : true, dropDups : true, required : true },
  accessToken: {type : String, required : true},
  birthday : {type : String},
  birthdaySettings : {type : birthdaySchema, default : birthdaySchema, required : true},
  eventSettings : {type : eventSchema, default : eventSchema, required : true}
});

let User = mongoose.model('User', userSchema);

const connection = mongoose.connection;
connection.on('error', () => {
  console.log("Failed to connect :(");
});
connection.once('open', () => {
  console.log("Connected to the database");
});


function saveNewUser(name, facebookUid, token, callback) {
  findUser(facebookUid, (err, users) => {
    if (err && callback) {
      return callback(err, users);
    }
    if(users.length > 0){
      let error = new Error("A user with the name " + name + " already exists");
      if(callback){
        callback(error);
      }
      return
    }
    let newUser = new User({name : name, facebookUid : facebookUid, accessToken : token});
    newUser.save((err, res) => {
      if(callback){
        return callback(err, res);
      }
      return res;
    });
  });
}

function findUser(facebookUid, callback) {
  User.find({facebookUid : facebookUid}, (err, res) => {
    if(callback){
      callback(err, res);
    } else {
      return res;
    }
  });

}
function findOrCreateUser(name, facebookUid, token, callback) {
  findUser(facebookUid, (err, users) => {
    if (err && callback) {
      return callback(err, users);
    }
    if(callback && users.length > 0){
      if(users[0].accessToken != token){
        users[0].accessToken = token;
        return users[0].save((err, res) =>{
          if(err){
            return handleError(err, callback);
          }
          return callback(err, res);
        });
      }
      return callback(err, users)
    }
    let newUser = new User({name : name, facebookUid : facebookUid, accessToken : token});
    newUser.save((err, res) => {
      if(callback){
        return callback(err, res);
      }
      return res;
    });
  });
}

let noUserFound = function (err, facebookUid, users, callback) {
  if(callback){
    if(err){
      return callback(err, null);
    }
    if(users.length == 0){
      return callback(new Error("No user found for id " + facebookUid), null);
    }
  }
  else{
    if(err){
      return err;
    }
    if(users.length == 0){
      return null;
    }
  }
};

let handleError = function (err, callback) {
  if(callback){
    return callback(err, null);
  }
  return null;
};

function getAuthTokenForUser(facebookUid, callback) {
   findUser(facebookUid, (err, users) => {
     if(err || users.length == 0){
       return noUserFound(err, facebookUid, users, callback);
     }
     if(callback){
       return callback(err, users[0].accessToken);
     }
     return users[0].accessToken;
   });
}

function setUserBirthday(facebookUid, birthday, callback) {
  findUser(facebookUid, (err, users) => {
    if(err || users.length == 0){
      return noUserFound(err, facebookUid, users, callback);
    }
    let user = users[0];
    user.birthday = birthday;
    user.save((err, res) =>{
      if(err){
        return handleError(err, callback);
      }
      if(callback){
        return callback(err, res);
      }
      return res;
    });
  });
}

this.saveNewUser = saveNewUser;
this.findUser = findUser;
this.findOrCreateUser = findOrCreateUser;
this.getAuthTokenForUser = getAuthTokenForUser;
this.setUserBirthday = setUserBirthday;