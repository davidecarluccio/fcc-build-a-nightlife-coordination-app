var login = require("./login");
var register = require("./register");
var User = require("../models/user");

module.exports = function (passport) {
	// For session management
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

    // For session management
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	
	login(passport);
	register(passport);
};