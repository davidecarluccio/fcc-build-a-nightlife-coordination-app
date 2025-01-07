var express = require("express");
var router = express.Router();
var Visitor = require("../models/visitor");

module.exports = function() {
    /* Handle visitor add POST */
    router.post("/add", function(req, res) {
        var username = req.body.username;
        if (req.user.username === username) {
            var pubId = req.body.pubId;
            var visitor = new Visitor();
            visitor.username = username;
            visitor.pubId = pubId;
            visitor.save(function(err, visitor) {
                if (err) {
                    throw err;
                } else {
                    res.json("Visit update correctly");
                }
            });
        } else {
            res.json("You cannot change someone else visiting");
        }
    });
    
    /* Handle visitor add POST */
    router.post("/remove", function(req, res) {
        var username = req.body.username;
        if (req.user.username === username) {
            var pubId = req.body.pubId;
            Visitor.find({"username" : username, "pubId" : pubId}).remove(function(err) {
               if (err) {
                   res.json("error removing visitor: " + err);
               } else {
                   res.json("Visitor removed sucessfully");
               }
            });
        } else {
            res.json("You cannot change someone else visiting");
        }
    });
    return router;
};
