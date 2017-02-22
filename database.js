"use strict";
const DATABASE_LOC = 'mongodb://heroku_5b8z7gld:h1h9h3h8bquori1ost3qaeqhn4@ds157469.mlab.com:57469/heroku_5b8z7gld';
const mongoose = require('mongoose');

mongoose.connect(DATABASE_LOC);

let userSchema = mongoose.Schema({
  name: {type : String, required : true},
  facebookUid : {type : String, unique : true, dropDups : true, required : true },
  token: {type : String, required : true}
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
  retreiveUser(facebookUid, (err, users) => {
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
    let newUser = new User({name : name, facebookUid : facebookUid, token : token});
    newUser.save((err, res) => {
      if(callback){
        return callback(err, res);
      }
      return res;
    });
  });
}

function retreiveUser(facebookUid, callback) {
  User.find({facebookUid : facebookUid}, (err, res) => {
    if(callback){
      callback(err, res);
    } else {
      return res;
    }
  });

}



this.saveNewUser = saveNewUser;
this.retreiveUser = retreiveUser;