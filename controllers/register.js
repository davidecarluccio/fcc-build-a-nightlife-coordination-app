var express = require("express");
var router = express.Router();
module.exports = function(passport) {
    /* Handle register POST */
    router.post("/", passport.authenticate("register", {
        successRedirect: "/login",
        successFlash : true,  
        failureRedirect: "/register",
        failureFlash : true  
    }));
    /* Handle register GET */
    router.get("/", function(req, res) {
        res.render("register", { message: req.flash("message") });
    });
    return router;
};
