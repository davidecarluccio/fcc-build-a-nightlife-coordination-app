var mongoose = require("mongoose");

module.exports = mongoose.model("Visitor", {
    username: String,
    pubId: String
});