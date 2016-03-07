var bcrypt = require('bcrypt');
var Q = require('q');
function cryptPassword (password) {
	var defer = Q.defer();
	bcrypt.genSalt(10, function(err, salt) {
    if (err){
      defer.reject(err);
    }
    bcrypt.hash(password, salt, function(err, hash) {
      if (err){
      	defer.reject(err);
      }
      defer.resolve(hash);
    });
  });
	return defer.promise;
}

function comparePassword (password,userPassword){
	var defer = Q.defer();
	bcrypt.compare(password, userPassword, function(err, isPasswordMatch) {
	   if (err){
        defer.reject(err);
      }
      defer.resolve(isPasswordMatch);
   });
	return defer.promise;
}

module.exports = {
	cryptPassword:cryptPassword,
	comparePassword:comparePassword
};