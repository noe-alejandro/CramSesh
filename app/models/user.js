var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password:{
    type: String
  },
  email: {
    type: String
  },
  full_name: {
    type: String
  },
  profile_pic: {
    type: String
  }
});

var User = module.exports = mongoose.model('User', UserSchema);

User.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

User.getUserByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);
}

User.updateProfilePic = function(username, callback){
  User.findOne({username: username}, callback);
}

User.getUserById = function(id, callback){
  User.findById(id, callback);
}

User.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if(err) throw err;
      callback(null, isMatch);
  });
}
