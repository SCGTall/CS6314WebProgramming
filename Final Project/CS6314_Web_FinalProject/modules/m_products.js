let db = require('../modules/database');
let g = require('../modules/globals');
let async = require('async');

const EMPTYPRODUCT = {
    "productID": -1,
    "productName": "",
    "categories": [],
    "productPrice": 0,
    "description": "",
    "image": "",
    "storeNum": 0,
    "visible": false,
}
exports.EMPTYPRODUCT = EMPTYPRODUCT;

// get all products
var getProducts = function(dic, key) {
    return new Promise((resolve, reject) => {
        let sql = "select * from PRODUCT order by ProductID DESC";  // new products at the front
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("getProducts");
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
                    console.log("getProducts");
                    console.log(results);
                }
                dic[key] = results;
                resolve();
            }
        });
    });
};
exports.getProducts = getProducts;

// get all products by ids
var getProductsByIDS = function(dic, key, idDic) {
    return new Promise((resolve, reject) => {
        let sql = "select * from PRODUCT";
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("getProductsByIDS");
                throw err;
            }
            else {
                let results = {};
                for (let elem of rows) {
                    let tmp = {};
                    let productID = elem['ProductID'];
                    if (idDic.hasOwnProperty(productID)) {
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
                }
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("getProductsByIDS");
                    console.log(results);
                }
                dic[key] = results;
                resolve();
            }
        });
    });
};
exports.getProductsByIDS = getProductsByIDS;

// fill categories for all products
var addCategories = function(dic, key) {
    return new Promise((resolve, reject) => {
        let sql = "select * from CATEGORY AS C, PRODUCT_OWN_CATEGORY AS PC where C.CategoryID=PC.CategoryID";
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("addCategories");
                throw err;
            }
            else {
                for (let elem of rows) {
                    let productID = elem['ProductID'];
                    let categoryName = elem['Name'];
                    if (dic[key].hasOwnProperty(productID)) {
                        dic[key][productID]["categories"].push(categoryName);
                    }
                }
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("addCategories");
                    console.log(dic[key]);
                }
                resolve();
            }
        });
    });
}
exports.addCategories = addCategories;

// select products by categoreis and keywords
var selectProducts = function(dic, key, products, categories, keywords) {
    return new Promise((resolve, reject) => {
        let selected = {};
        Object.keys(products).forEach(function(productID) {
            let flag = true;
            let productCategories = products[productID]["categories"];
            let productNameLC = products[productID]["productName"].toLowerCase();
            for (let category of categories){
                if (flag && productCategories.indexOf(category) === -1){
                    flag = false;
                    if (g.logLevel <= g.Level.DEBUGGING) {
                        console.log(products[productID]);
                        console.log(category);
                    }
                }
            }
            for (let keyword of keywords){
                if (flag && productNameLC.indexOf(keyword) === -1){
                    flag = false;
                    if (g.logLevel <= g.Level.DEBUGGING) {
                        console.log(products[productID]);
                        console.log(keyword);
                    }
                }
            }
            if (flag) {
                selected[productID] = products[productID];
            }
        })
        dic[key] = selected;
        if (g.logLevel <= g.Level.DEBUGGING) {
            console.log("selectProducts");
            console.log(categories);
            console.log(keywords);
        }
        resolve();
    });
}
exports.selectProducts = selectProducts;

// get all categories
var getCategories = function(dic, key) {
    return new Promise((resolve, reject) => {
        let sql = "select * from CATEGORY order by CategoryID ASC";
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("getCategories");
                throw err;
            }
            else {
                let results = [];
                for (let elem of rows) {
                    results.push({
                        "categoryID": elem['CategoryID'],
                        "categoryName": elem['Name'],
                    });
                }
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("getCategories");
                    console.log(results);
                }
                dic[key] = results
                resolve();
            }
        });
    });
};
exports.getCategories = getCategories;

// generate filter string
var generateFilterString = function(dic, key, categories, keywords, text) {
    return new Promise((resolve, reject) => {
        if (g.logLevel <= g.Level.DEVELOPING) {
            console.log("generateFilterString");
            console.log(categories);
            console.log(keywords);
            console.log(text);
        }
        if (categories.length > 0) {
            if (keywords.length > 0) {
                dic[key] = "All " + categories.join(', ') + ": " + text;
                resolve();
            } else {
                dic[key] = "All " + categories.join(', ') + ":";
                resolve();
            } 
        } else {
            if (keywords.length > 0) {
                dic[key] = "All categories: " + text;
                resolve();
            } else {
                dic[key] = "";
                resolve();
            }
        }
    });
};
exports.generateFilterString = generateFilterString;

// get next available productID
var getNextProductID = function(dic, key) {
    return new Promise((resolve, reject) => {
        let sql = "select ProductID from PRODUCT order by ProductID ASC";
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("getNextProductID");
                throw err;
            }
            else {
                let newID = 0;
                for (let elem of rows) {
                    let _id = elem['ProductID'];
                    if (_id !== newID) {
                        break;
                    }
                    newID = newID + 1;
                }
                dic[key] = newID;
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("getNextProductID");
                    console.log(newID);
                }
                resolve();
            }
        });
    });
}
exports.getNextProductID = getNextProductID;

// keep useless old image
var keepOldImage = function(dic, key, key2, productID) {
    return new Promise((resolve, reject) => {
        let sql = "select Image from PRODUCT where ProductID=" + productID;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("keepOldImage");
                throw err;
            }
            else {
                dic[key][key2] = rows[0]["Image"];
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("keepOldImage");
                }
                resolve();
            }
        });
    });
}
exports.keepOldImage = keepOldImage;

// update product
var updateProduct = function(dic, key, productID, product) {
    return new Promise((resolve, reject) => {
        let visible = product["visible"] ? 1 : 0;
        let sql = "replace INTO PRODUCT (ProductID, Name, Price, Description, Image, Visible, Num) VALUES (" + productID + ", '" + product["productName"] + "', " + product["productPrice"] + ", '" + product["description"] + "', '" + product["image"] + "', " + visible + ", " + product["storeNum"] + ")";
        if (product["image"] === undefined || product["image"] == "") {  // do not update image if not provided
            let sql = "replace INTO PRODUCT (ProductID, Name, Price, Description, Visible, Num) VALUES (" + productID + ", '" + product["productName"] + "', " + product["productPrice"] + ", '" + product["description"] + "', " + visible + ", " + product["storeNum"] + ")";
        }
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("updateProduct");
                throw err;
            }
            else {
                dic[key] = true;
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("updateProduct");
                }
                resolve();
            }
        });
    });
};
exports.updateProduct = updateProduct;

// soft delete product
var deleteProduct = function(dic, key, productID) {
    return new Promise((resolve, reject) => {
        let sql = "update PRODUCT SET Visible=0, Num=0 where ProductID=" + productID;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("deleteProduct");
                throw err;
            }
            else {
                dic[key] = true;
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("deleteProduct");
                }
                resolve();
            }
        });
    });
};
exports.deleteProduct = deleteProduct;

// relax categories
var relaxCategories = function(dic, key, productID, product, categories, allCategories) {
    return new Promise((resolve, reject) => {
        let cDic = {};
        let nextID = 0;
        for (let c of allCategories) {
            cDic[c["categoryName"]] = c["categoryID"];
            if (c["categoryID"] >= nextID) {
                nextID = c["categoryID"] + 1;
            }
        }
        let sqls = [];
        sqls.push("delete FROM PRODUCT_OWN_CATEGORY where ProductID=" + productID + ";");
        for (let c of categories) {
            let cid = cDic[c];
            if (!cDic.hasOwnProperty(c)) {
                cid = nextID;
                sqls.push("insert INTO CATEGORY (CategoryID, Name) VALUES (" + cid +", '" + c + "');");
                nextID = nextID + 1;
            }
            sqls.push("insert INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID) VALUES(" + productID + ", " + cid + ");");
        }
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
                console.log("relaxCategories");
                throw err;
            } else {
                if (g.logLevel <= g.Level.DEBUGGING) {
                    console.log("relaxCategories");
                }
                dic[key] = true;
                resolve();
            }
        });
    });
};
exports.relaxCategories = relaxCategories;

// sell products
var sellProducts = function(dic, key, purchase) {
    return new Promise((resolve, reject) => {
        let sqls = [];
        Object.keys(purchase).forEach(function(pid) {
            let num = purchase[pid]["cartNum"];
            sqls.push("update PRODUCT SET Num=Num-" + num + " where ProductID=" + pid);
        })
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
                console.log("sellProducts");
                throw err;
            } else {
                if (g.logLevel <= g.Level.DEBUGGING) {
                    console.log("sellProducts");
                }
                dic[key] = true;
                resolve();
            }
        });
    });
}
exports.sellProducts = sellProducts;


const CAROUSELSIZE = 4;
// select products for carousel
var selectCarousel = function(dic, key, products, categories, hot) {
    return new Promise((resolve, reject) => {
        let selected = { "Hot": [] };
        for (let category of categories) {
            selected[category["categoryName"]] = [];
        }
        for (let elem of hot) {
            let productID = elem["productID"];
            let product = products[productID];
            if (selected["Hot"].length < CAROUSELSIZE) {
                selected["Hot"].push({ productID: product});
            }
            for (let category of product["categories"]) {
                if (selected[category].length < CAROUSELSIZE) {
                    selected[category].push({ productID: product});
                }
            }
        }
        let empty = [];
        Object.keys(selected).forEach(function(title) {
            if (selected[title].length === 0) {
                empty.push(title);
            }
        })
        for (let title of empty) {
            delete selected[title];
        }
        if (g.logLevel <= g.Level.DEBUGGING) {
            console.log("selectCarousel");
            console.log(selected);
        }
        dic[key] = selected;
        resolve();
    });
}
exports.selectCarousel = selectCarousel;


