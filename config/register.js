var bCrypt = require("bcrypt-nodejs");
var LocalStrategy   = require("passport-local").Strategy;
var User = require("../models/user");

module.exports = function(passport) {
    // For user register
	passport.use("register", new LocalStrategy({ passReqToCallback : true }
		, applyRegisterStrategy
	));
};

function applyRegisterStrategy(req, username, password, done) {
    console.log("LocalStrategy Register hit!");
    User.findOne({ "username" : username }
    	, insertUser.bind(null, req, username, password, done)
	);
}

function insertUser(req, username, password, done, err, user) {
    if (err) {
        return done(err);
    }
    if (user) {
        console.log("User already exists with username " + username);
        return done(null, false, req.flash("message", "User already exists"));
    } else {
    	var user = new User();
    	user.username = username;
    	user.password = createHash(password);
    	user.save(function(err) {
    		if (err) {
    			console.log("Error saving user " + err);
    			throw err;
    		}
    		console.log("User registered with success");
    		return done(null, user, req.flash("message", "User registered with success"));
    	});
    }
}

// Generates hash using bCrypt
function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
