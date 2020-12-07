var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res) {
    let dir = "./public/data/occupied.json";
    fs.exists(dir, function(exists) {
        if (exists) {
            let data = fs.readFileSync(dir);
            let content = JSON.parse(data);
            res.json(content);
        } else {
            res.send("No.")
        }
    });
    console.log("test");
});

module.exports = router;