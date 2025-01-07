var express = require("express");
var router = express.Router();
module.exports = function(passport) {
    router.get("/", function(req, res) {
        var resContent = { user: req.user, authenticated: req.isAuthenticated() };
        var session = req.session;
        resContent.businesses = session.businesses;
        resContent.message = req.flash("message");
        res.render("home", resContent);
    });
    /* Handle Logout */
	router.get("/logout", function(req, res) {
		req.logout();
		res.redirect("/");
	});
    router.use("/login", require("./login")(passport));
    router.use("/register", require("./register")(passport));
    router.use("/search", require("./search")(passport));
    router.use("/visitor", require("./visitor")(passport));
    return router;
}
