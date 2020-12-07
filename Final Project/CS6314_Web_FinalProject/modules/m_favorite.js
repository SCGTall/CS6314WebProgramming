let db = require('../modules/database');
let g = require('../modules/globals');
let async = require('async');

const SALESTAX = 0.0825;
const SHIPPING = 0;

// products in favorite
var getFavorite = function(dic, key, customerID) {
    return new Promise((resolve, reject) => {
        let sql = "select FP.ProductID, P.Name, P.Price, P.Description, P.Image, P.Visible, P.Num from FAVORITE_OWN_PRODUCT FP, PRODUCT P where FP.AccountID=" + customerID + " and FP.ProductID=P.ProductID";
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("getFavorite");
                throw err;
            }
            else {
                let results = {};
                for (let elem of rows) {
                    let tmp = {};
                    let productID = elem['ProductID'];
                    tmp["productID"] = elem['ProductID'];
                    tmp["productName"] = elem['Name'];
                    tmp["categories"] = [];
                    tmp["productPrice"] = elem['Price'];
                    tmp["description"] = elem['Description'];
                    tmp["image"] = elem['Image'];
                    tmp["storeNum"] = elem['Num'];
                    if (elem['Visible'] == 0) {
                        tmp["visible"] = false;
                    } else {
                        tmp["visible"] = true;
                    }
                    results[productID] = tmp;
                }
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("getFavorite");
                    console.log(results);
                }
                dic[key] = results;
                resolve();
            }
        });
    });
}
exports.getFavorite = getFavorite;

// only get productID in favorite
var getBriefFavorite = function(dic, key, customerID) {
    return new Promise((resolve, reject) => {
        if (isNaN(Number(customerID))) {
            dic[key] = [];
            resolve();
        } else {
            let sql = "select ProductID from FAVORITE_OWN_PRODUCT where AccountID=" + customerID;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log("getBriefFavorite");
                    throw err;
                }
                else {
                    let results = {};
                    for (let elem of rows) {
                        results[elem["ProductID"]] = 0;
                    }
                    if (g.logLevel <= g.Level.DEVELOPING) {
                        console.log("getBriefFavorite");
                        console.log(results);
                    }
                    dic[key] = results;
                    resolve();
                }
            });
        }
    });
}
exports.getBriefFavorite = getBriefFavorite;

var updateFavoriteTable = function(dic, key) {
    return new Promise((resolve, reject) => {
        let sqls = [
            "TRUNCATE TABLE FAVORITE",
            "INSERT INTO FAVORITE select DISTINCT AccountID from FAVORITE_OWN_PRODUCT"
        ]
        async.eachSeries(sqls, function(sql, callback) {
            db.query(sql, (err, rows) => {
                if (err) {
                    callback(err);
                } else {
                    callback();
                }
            });
        }, function(err) {  // callback after all queries
            if (err) {
                console.log("updateFavoriteTable");
                throw err;
            } else {
                if (g.logLevel <= g.Level.DEBUGGING) {
                    console.log("updateFavoriteTable");
                }
                dic[key] = true;
                resolve();
            }
        });
    });
}
exports.updateFavoriteTable = updateFavoriteTable;

//  add function for favorite
var addToFavorite = function(dic, key, cid, pid) {
    let sql = "replace INTO FAVORITE_OWN_PRODUCT (AccountID, ProductID) VALUES (" + cid + ", " + pid + ")";
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("addToFavorite");
                throw err;
            }
            else {
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("addToFavorite");
                }
                dic[key] = true;
                resolve();
            }
        });
    });
}
exports.addToFavorite = addToFavorite;

//  remove function for favorite
var removeFromFavorite = function(dic, key, cid, pid) {
    let sql = "delete FROM FAVORITE_OWN_PRODUCT where AccountID=" + cid + " AND ProductID=" + pid;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("removeFromFavorite");
                throw err;
            }
            else {
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("removeFromFavorite");
                }
                dic[key] = true;
                resolve();
            }
        });
    });
}
exports.removeFromFavorite = removeFromFavorite;
