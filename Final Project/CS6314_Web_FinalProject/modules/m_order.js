let db = require('../modules/database');
let g = require('../modules/globals');
let async = require('async');
var mp = require('../modules/m_products');

const EMPTYORDER = {
    "orderID": -1,
    "customerID": -1,
    "purchaseDate": "",
    "totalPrice": 0,
    "comments": "",
    "products": {},
}
exports.EMPTYORDER = EMPTYORDER;

// get all order details for possible change happened to product
var getOrderDetails = function(dic, key) {
    return new Promise((resolve, reject) => {
        let sql = "select * from ORDER_DETAIL";
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("getOrderDetails");
                throw err;
            }
            else {
                let results = {};
                for (let elem of rows) {
                    let orderID = elem['OrderID'];
                    if (!results.hasOwnProperty(orderID)) {
                        results[orderID] = {};
                    }
                    let tmp = {};
                    let productID = elem['ProductID'];
                    tmp["orderID"] = elem['OrderID'];
                    tmp["productID"] = elem['ProductID'];
                    tmp["productName"] = elem['Name'];
                    tmp["productPrice"] = elem['Price'];
                    tmp["purchaseNum"] = elem['Num'];
                    results[orderID][productID] = tmp;
                }
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("getOrderDetails");
                    console.log(results);
                }
                dic[key] = results;
                resolve();
            }
        });
    });
};
exports.getOrderDetails = getOrderDetails;

// get all orders
var getOrders = function(dic, key, cid) {
    return new Promise((resolve, reject) => {
        let sql = "select * from FOOD_ORDER where AccountID=" + cid + " order by PurchaseDate DESC";  // new orders at the front
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("getOrders");
                throw err;
            }
            else {
                let results = {};
                for (let elem of rows) {
                    let tmp = {};
                    let orderID = elem['OrderID'];
                    tmp["orderID"] = elem['OrderID'];
                    tmp["customerID"] = elem['AccountID'];
                    tmp["purchaseDate"] = elem['PurchaseDate'];
                    tmp["totalPrice"] = elem['TotalPrice'];
                    tmp["comments"] = elem['Comments'];
                    tmp["products"] = {};
                    results[orderID] = tmp;
                }
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("getOrders");
                    console.log(results);
                }
                dic[key] = results;
                resolve();
            }
        });
    });
};
exports.getOrders = getOrders;

// fill products in each order
var fillProductsInOrders = function(dic, key, products, orderDetails) {
    return new Promise((resolve, reject) => {
        Object.keys(dic[key]).forEach(function(orderID) {
            let details = orderDetails[orderID];
            Object.keys(details).forEach(function(productID) {
                if (products.hasOwnProperty(productID)) {
                    dic[key][orderID]["products"][productID] = products[productID];
                } else {
                    dic[key][orderID]["products"][productID] = mp.EMPTYPRODUCT;
                    dic[key][orderID]["products"][productID]["productID"] = productID;
                }
                dic[key][orderID]["products"][productID]["productName"] = details[productID]["productName"];
                dic[key][orderID]["products"][productID]["productPrice"] = details[productID]["productPrice"];
                dic[key][orderID]["products"][productID]["purchaseNum"] = details[productID]["purchaseNum"];
            })
        })
        if (g.logLevel <= g.Level.DEVELOPING) {
            console.log("fillProductsInOrders");
            console.log(dic[key]);
        }
        resolve();
    });
};
exports.fillProductsInOrders = fillProductsInOrders;

// submit comment for one order
var updateComments = function(dic, key, oid, comments) {
    return new Promise((resolve, reject) => {
        let sql = "update FOOD_ORDER SET Comments='" + comments + " where OrderID=" + oid;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("updateComments");
                throw err;
            }
            else {
                dic[key] = comment;
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("updateComments");
                    console.log(dic[key]);
                }
                resolve();
            }
        });
    });
};
exports.updateComments = updateComments;

// get next available orderID
var getNextOrderID = function(dic, key) {
    return new Promise((resolve, reject) => {
        let sql = "select MAX(OrderID) from FOOD_ORDER";
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("getNextOrderID");
                throw err;
            }
            else {
                if (rows.length === 0) {
                    dic[key] = 0;
                } else {
                    dic[key] = Number(rows[0]["MAX(OrderID)"]) + 1;
                }
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("getNextOrderID");
                }
                resolve();
            }
        });
    });
}
exports.getNextOrderID = getNextOrderID;

// save new order
var newOrder = function(dic, key, newID, cid, total, purchase) {
    return new Promise((resolve, reject) => {
        let now = new Date().toLocaleDateString('en-US');
        let totalPrice = total["total"].replace('$', '');
        let sqls = ["insert INTO FOOD_ORDER (OrderID, AccountID, PurchaseDate, TotalPrice, Comments) VALUES (" + newID + ", " + cid + ", '" + now + "', " + totalPrice + ", 'No comments yet.')"];
        Object.keys(purchase).forEach(function(pid) {
            let num = purchase[pid]["cartNum"];
            let name = purchase[pid]["productName"];
            let price = purchase[pid]["productPrice"];
            sqls.push("insert INTO ORDER_OWN_PRODUCT (OrderID, ProductID, Num) VALUES (" + newID + ", " + pid + ", " + num + ")");
            sqls.push("insert INTO ORDER_DETAIL (OrderID, ProductID, Name, Price, Num) VALUES (" + newID + ", " + pid + ", '" + name + "', " + price + ", " + num + ")");
        });
        async.eachSeries(sqls, function(sql, callback) {
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log("getNextOrderID");
                    throw err;
                } else {
                    callback();
                }
            });
        }, function(err) {  // callback after all queries
            if (err) {
                console.log(err);
            } else {
                if (g.logLevel <= g.Level.DEBUGGING) {
                    console.log("newOrder");
                }
                dic[key] = true;
                resolve();
            }
        });
    });
}
exports.newOrder = newOrder;

// analysis for all orders
var findHotProducts = function(dic, key) {
    return new Promise((resolve, reject) => {
        let sql = "select ProductID, SUM(Num) from ORDER_OWN_PRODUCT group by ProductID order by SUM(Num) DESC";
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("findHotProducts");
                throw err;
            }
            else {
                let results = [];
                for (let elem of rows) {
                    tmp = {
                        "productID": elem["ProductID"],
                        "sum": elem["SUM(Num)"],
                    };
                    results.push(tmp);
                }
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("findHotProducts");
                }
                dic[key] = results;
                resolve();
            }
        });
    });
}
exports.findHotProducts = findHotProducts;

