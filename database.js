"use strict";
const DATABASE_LOC = 'mongodb://localhost:9801';
const mongoose = require('mongoose');

mongoose.connect(DATABASE_LOC);

let userSchema = mongoose.Schema({
  name: String,
  facebookUid : String,
  token: String
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
  User.find({facebookUid : facebookUid}, (err, res) => callback(err, res));
}



this.saveNewUser = saveNewUser;
this.retreiveUser = retreiveUser;