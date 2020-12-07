var express = require('express');
var router = express.Router();
let db = require('../modules/database');
var async = require('async');


// date format
function formatDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

router.get('/', function(req, res) {
    let now = new Date();
    results = [];
    results.push(now);
    results.push(now.toLocaleDateString('en-US'));
    results.push(Date.parse(now.toLocaleDateString('en-US')));
    res.send(results);
});


module.exports = router;