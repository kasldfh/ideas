var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

router.get('/', function (req, res) {
        res.render('index', { user : req.user });
        });

router.get('/register', function(req, res) {
        res.render('register', { });
        });

router.post('/register', function(req, res) {
        Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
                if (err) {
                return res.render('register', { account : account });
                }
        passport.authenticate('local')(req, res, function () {
                res.redirect('/');
                });

            });
    });
    

router.get('/login', function(req, res) {
        res.render('login', { user : req.user });
        });

router.post('/login', passport.authenticate('local'), function(req, res) {
        res.redirect('/ideas');
        });

router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
        });

router.get('/ping', function(req, res){
        res.status(200).send("pong!");
        });


/* POST to Add Idea */
router.post('/addidea', function(req, res) {

        // Set our internal DB variable
        var db = req.db;

        // Get our form values. These rely on the "name" attributes
        var text = req.body.text;
        var username = req.user.username;
        console.log(req.user.username);

        // Set our collection
        var collection = db.get('ideas');

        // Submit to the DB
        collection.insert({
                "username" : username,
                "text" : text
                }, function (err, doc) {
                if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
                }
                else {
                // And forward to success page
                res.redirect("/ideas");
                }
                });
});

/* GET to remove idea*/
router.post('/deleteidea', function(req, res) {
    var db = req.db;
    var ObjectID = require('mongodb').ObjectID;
    var id = req.body.id.toString();
    //var id = new ObjectID(req.id); 
    var collection = db.get('ideas');
    collection.remove({"_id": id }, function (err, docs) {
        if(err) return err;
        }); 
    res.redirect("/ideas");
});


//TODO: if someone isn't logged in, redirect to login or home page
/*GET thoughts page */
router.get('/ideas', function(req, res) {
        var db = req.db;
        var collection = db.get('ideas');
        collection.find({username : req.user.username},{},function(e,docs){
                console.log(docs);
                res.render('ideas', {"user" : req.user, "ideas" : docs}
                        );
                });
        });

module.exports = router;
