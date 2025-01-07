var bCrypt = require("bcrypt-nodejs");
var LocalStrategy   = require("passport-local").Strategy;
var User = require("../models/user");

module.exports = function(passport) {
    // For login
	passport.use("login", new LocalStrategy({ passReqToCallback : true }
		, applyLoginStrategy));
};

function applyLoginStrategy(req, username, password, done) {
	console.log("LocalStrategy Login hit!");
    User.findOne({ "username" : username }
    	, login.bind(null, req, username, password, done)
    );
}

function login(req, username, password, done, err, user) {
	if (err) {
        return done(err);
    }
    if (!user) {
        console.log("User not found with username " + username);
        return done(null, false, req.flash("message", "User not found"));
    }
    if (!isValidPassword(user, password)) {
        console.log("Invalid Password!");
        return done(null, false, req.flash("message", "Invalid Password"));
    }
    // Just clean search history
    var session = req.session;
    session.businesses = undefined;
    return done(null, user);
}

function isValidPassword(user, password) {
	return bCrypt.compareSync(password, user.password);
}