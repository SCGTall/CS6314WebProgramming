var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    let user = req.session.user;
    console.log(user);
    if (user === null) {
        console.log("Case 1");
    } else if (user === undefined) {
        console.log("Case 2");
    } else if (user === NaN) {
        console.log("Case 3");
    } else if (user === "") {
        console.log("Case 4");
    } else if (user === {}) {
        console.log("Case 5");
    } else if (user === []) {
        console.log("Case 6");
    } else {
        console.log("Case 7");
    }
    res.send("For test");
});

module.exports = router;