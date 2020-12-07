var express = require('express');
var router = express.Router();

let db = require('../modules/database');

function getProducts(res, callback) {
    let js = {}
    let sql = "select * from PRODUCT";
    let array = [];
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        else {
            for (let elem of rows) {
                let tmp = {};
                tmp["productID"] = elem['ProductID'];
                tmp["productName"] = elem['Name'];
                console.log(elem['Name']);
                tmp["productPrice"] = elem['Price'];
                tmp["description"] = elem['Description'];
                tmp["image"] = elem['Image'];
                tmp["num"] = elem['Num'];
                if (elem['Visible'] == 0) {
                    tmp["visible"] = false;
                } else {
                    tmp["visible"] = true;
                }
                array.push(tmp);
            }
            js["products"] = array;
            callback(res, js);
        };
    });
}

function output(res, js) {
    res.json(js);
}

router.get('/', function(req, res) {
    getProducts(res, output);
    console.log("show_product.js.");
});

module.exports = router;