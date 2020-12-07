var express = require('express');
var router = express.Router();
let db = require('../modules/database');
var async = require('async');

var testSQLs = function(dic) {
    return new Promise((resolve, reject) => {
        let sqls = [
            "TRUNCATE TABLE CART",
            "insert INTO CART select DISTINCT AccountID from CART_OWN_PRODUCT",
            "select * from CART",
            "replace INTO CART (AccountID) VALUES (102)",
            "delete FROM CART where AccountID=102",
            //"insert INTO CART (AccountID) VALUES (105)",
        ]
        async.eachSeries(sqls, function(sql, callback) {
            db.query(sql, (err, rows) => {
                console.log(rows);
                if (err) {
                    callback(err);
                } else {
                    dic[sql] = rows;
                    callback();
                }
            });
        }, function(err) {  // callback after all queries
            if (err) {
                console.log(err);
                throw err;
            } else {
                resolve();
            }
        });
    });
};

// sign in
router.get('/', function(req, res) {
    let asyncFunc = async () => {
        let results = {}
        let p1 = await testSQLs(results);
        return Promise.resolve(results);
    }
    asyncFunc().then(results => {
        res.send(results);
    })
});

module.exports = router;