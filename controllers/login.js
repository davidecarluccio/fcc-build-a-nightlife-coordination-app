var express = require("express");
var router = express.Router();
module.exports = function(passport) {
    /* Handle login POST */
    router.post("/", passport.authenticate("login", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash : true  
    }));
    /* Handle login GET */
    router.get("/", function(req, res) {
        // Display the Login page with any flash message, if any
        res.render("login", { message: req.flash("message") });
    });
    return router;
};
