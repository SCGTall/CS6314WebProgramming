var express = require('express');
var router = express.Router();

let db = require('../modules/test_database');

router.get('/', function(req, res) {
    let sql = "select * from notes";
    let mydata = [];
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        else {
            for (let elem of rows) {
                let record = [elem['id'], elem['note']];
                mydata.push(record);
            }
            res.json(mydata);
        };
    });
    //res.send("Success!");
});

module.exports = router;