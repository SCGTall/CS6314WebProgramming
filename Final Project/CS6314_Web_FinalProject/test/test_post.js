var express = require('express');
var router = express.Router();

var g = require('../modules/globals');

router.post('/', function(req, res) {
    if (g.logLevel <= g.Level.TESTING) {
        console.log("test!!!");
    };
});

router.post('/signin', function(req, res) {
    if (g.logLevel <= g.Level.TESTING) {
        console.log("test for sign in!!!");
    };
});

router.post('/signup', function(req, res) {
    if (g.logLevel <= g.Level.TESTING) {
        console.log("test for signup!!!");
    };
});

module.exports = router;