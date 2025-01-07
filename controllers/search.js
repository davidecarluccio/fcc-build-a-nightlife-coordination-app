var express = require("express");
var router = express.Router();
var Visitor = require("../models/visitor");

var axios = require("axios"); // Usato al posto di request
var _ = require("lodash");

function callOpenStreetMapAPI(searchLocation, callback) {
    // Configura la query Overpass per trovare bar in un raggio di 1000 metri
    var overpassUrl = 'https://overpass-api.de/api/interpreter';
    var query = `
        [out:json];
        node
          [amenity=bar]
          (around:1000,${searchLocation.lat},${searchLocation.lon});
        out body;
    `;
    
    // Richiesta all'API di Overpass
    axios.post(overpassUrl, `data=${encodeURIComponent(query)}`)
        .then(response => {
            return callback(null, response, response.data);
        })
        .catch(error => {
            return callback(error);
        });
}

module.exports = function() {
    // Gestiamo il POST della ricerca
    router.post("/", function(req, res) {
        var town = req.body.town;

        // Verifica se la città è valida
        if (!town || town.trim() === "") {
            req.flash("message", "Per favore inserisci una città valida.");
            return res.redirect("/");
        }

        // Geolocalizzazione della città per ottenere latitudine e longitudine (questa parte va implementata)
        var searchLocation = {
            lat: 40.350, // Esempio di latitudine
            lon: 18.178  // Esempio di longitudine
        };

        // Chiamata all'API di OpenStreetMap (Overpass)
        callOpenStreetMapAPI(searchLocation, function(error, response, body) {
            if (error) {
                console.error("Errore durante la chiamata all'API di OpenStreetMap:", error);
                req.flash("message", "Si è verificato un errore durante la ricerca.");
                return res.redirect("/");
            }

            // Verifica se la risposta è valida
            var results;
            try {
                results = body.elements;
            } catch (e) {
                console.error("Errore durante il parsing della risposta:", e);
                req.flash("message", "Errore nel parsing dei dati ricevuti.");
                return res.redirect("/");
            }

            var resContent = { user: req.user, authenticated: req.isAuthenticated() };

            // Prepariamo i dati per la visualizzazione
            resContent.businesses = results;
            var pubIds = [];
            for (var i = 0; i < resContent.businesses.length; i++) {
                pubIds.push(resContent.businesses[i].id);
                resContent.businesses[i].visitorsQty = 0;
            }

            // Troviamo i visitatori associati ai locali
            Visitor.find({ pubId: { $in: pubIds } })
            .then(visitors => {
                if (req.isAuthenticated()) {
                    for (var j = 0; j < visitors.length; j++) {
                        for (var i = 0; i < resContent.businesses.length; i++) {
                            if (resContent.businesses[i].id === visitors[j].pubId) {
                                resContent.businesses[i].visitorsQty += 1;
                                if (visitors[j].username === req.user.username) {
                                    resContent.businesses[i].userIsAVisitor = true;
                                }
                            }
                        }
                    }
                }

                // Salviamo le informazioni dei locali nella sessione
                var session = req.session;
                session.businesses = resContent.businesses;

                // Renderizziamo la vista con i dati aggiornati
                res.render("home", resContent);
            })
            .catch(err => {
                console.error("Errore nel recupero dei visitatori:", err);
                return res.status(500).send("Errore nel recupero dei visitatori.");
            });
        });
    });

    return router;
};
