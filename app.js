var express = require("express");
var app = express();

require("dotenv").config(); // Carica le variabili d'ambiente

// Body Parser
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Flash Middleware
var flash = require("connect-flash");
app.use(flash());

// Mongoose Config
var mongoose = require("mongoose");
var dbUrl = process.env.NIGHTLIFE_APP_DB_URL;

if (!dbUrl) {
    console.error("Errore: NIGHTLIFE_APP_DB_URL non definito.");
    process.exit(1);
}

mongoose.connect(dbUrl, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log("Connesso a MongoDB"))
.catch(err => console.error("Errore di connessione a MongoDB:", err));

// Configurazione Passport
var passport = require("passport");
var expressSession = require("express-session");
app.use(expressSession({
    secret: "MySecretKey",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

// Mustache Config
var mustacheExpress = require("mustache-express");
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

// Static Files
app.use(express.static(__dirname + '/public'));

// Controllers
app.use(require("./controllers")(passport));

// Avvio del Server
var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log("dbUrl = " + dbUrl);
    console.log("Nightlife Listening on port " + port);
});
