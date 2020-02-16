var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var twit = require("twit");

var User = mongoose.model('User');
var auth = jwt({ secret: 'SECRET', userProperty: 'payload' });
var twitterApp = new twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: false, // optional - requires SSL certificates to be valid.
});

/* GET Index page. */
router.get('/', function(req, res) {
    res.render('index');
});

/* GET Home page. */
router.get('/home', function(req, res) {
    res.render('index');
});

router.get('/tweets', auth, function(req, res, next) {
    twitterApp.get('search/tweets', {
        q: req.query.source,
        count: 100,
        result_type: "mixed"
    }).catch(function(err) {
        return next(err);
    }).then(function(result) {
        res.json(result ? result.data : []);
    });
});

router.post('/register', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }

    User.findOne({ "username": req.body.username }, function(err, udata) {
        if (err) {
            return next(err);
        }
        if (udata) {
            return res.status(400).json({ message: 'A User already exist with this username, please try something diffrent.' });
        } else {
            var user = new User();
            user.username = req.body.username;
            user.setPassword(req.body.password)
            user.save(function(err) {
                if (err) { return next(err); }
                return res.json({ token: user.generateJWT() })
            });
        }
    });
});

router.get('/login', function(req, res, next) {
    res.render('index');
});

router.post('/login', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }

        if (user) {
            var new_token = user.generateJWT();
            return res.json({ token: new_token });
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

module.exports = router;