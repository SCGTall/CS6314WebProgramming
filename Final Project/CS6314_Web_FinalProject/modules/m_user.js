let db = require('../modules/database');
let g = require('../modules/globals');
let h = require('../modules/hash');

const EMPTYUSER = {
    "category": "anonymous",
    "accountID": -1,
    "email": "",
    "username": "Guest",
    "password": "",
    "details": {}
}

// resolve user
var resolveUser = function(user) {
   if (user === undefined) {
        return EMPTYUSER;
    } else {
        return user;
    }
};
exports.resolveUser = resolveUser;

const ADMINRESERVE = 99;  // maximum AccountID of admin

// get customers by email
var getCustomers = function(dic, key, email) {
    return new Promise((resolve, reject) => {
        let sql = "select * from CUSTOMER";
        if (email !== undefined && email !== "") {
            sql = "select * from CUSTOMER where Email='" + email + "'";
        }
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("getCustomers");
                throw err;
            }
            else {
                let results = [];
                for (let elem of rows) {
                    let tmp = {};
                    tmp["category"] = "customer";
                    tmp["customerID"] = elem['AccountID'];
                    tmp["email"] = elem['Email'];
                    tmp["username"] = elem['UserName'];
                    tmp["password"] = elem['Password'];
                    tmp["details"] = {
                        "firstName": elem['Fname'],
                        "lastName": elem['Lname'],
                        "dateOfBirth": elem['DateOfBirth'],
                        "phone": elem['Phone'],
                        "card": elem['Card'],
                        "expDate": elem['ExpDate'],
                        "secCode": elem['SecCode'],
                        "street": elem['Street'],
                        "city": elem['City'],
                        "zip": elem['Zip'],
                        "state": elem['State'],
                    };
                    results.push(tmp);
                }
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("getCustomers");
                    console.log(results);
                }
                dic[key] = results
                resolve();
            }
        });
    });
};
exports.getCustomers = getCustomers;

// view one attribute of all customers
var checkInCUSTOMER = function(dic, key, attrname, attrvalue) {
    return new Promise((resolve, reject) => {
        let sql = "select AccountID, " + attrname + " from CUSTOMER";
        if (attrvalue !== undefined){
            if (isNaN(Number(attrvalue))) {
                sql = "select AccountID, " + attrname + " from CUSTOMER where " + attrname + "='" + attrvalue + "'";
            } else {
                sql = "select AccountID, " + attrname + " from CUSTOMER where " + attrname + "=" + attrvalue;
            }
        }
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("checkInCUSTOMER");
                throw err;
            }
            else {
                let results = [];
                for (let elem of rows) {
                    let tmp = {};
                    tmp["customerID"] = elem['AccountID'];
                    tmp["email"] = elem['Email'];
                    results.push(tmp);
                }
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("checkInCUSTOM");
                    console.log(results);
                }
                dic[key] = results
                resolve();
            }
        });
    });
};
exports.checkInCUSTOMER = checkInCUSTOMER;

// get admins by email
var getAdmins = function(dic, key, email) {
    return new Promise((resolve, reject) => {
        let sql = "select * from ADMIN";
        if (email !== undefined && email !== "") {
            sql = "select * from ADMIN where Email='" + email + "'";
        }
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("getAdmins");
                throw err;
            }
            else {
                let results = [];
                for (let elem of rows) {
                    let tmp = {};
                    tmp["category"] = "admin";
                    tmp["adminID"] = elem['AccountID'];
                    tmp["email"] = elem['Email'];
                    tmp["username"] = elem['UserName'];
                    tmp["password"] = elem['Password'];
                    tmp["details"] = {
                        "firstName": elem['Fname'],
                        "lastName": elem['Lname'],
                        "dateOfBirth": elem['DateOfBirth'],
                        "phone": elem['Phone'],
                    };
                    results.push(tmp);
                }
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("getAdmins");
                    console.log(results);
                }
                dic[key] = results
                resolve();
            }
        });
    });
};
exports.getAdmins = getAdmins;

// view one attribute of all admins
var checkInADMIN = function(dic, key, attrname, attrvalue) {
    return new Promise((resolve, reject) => {
        let sql = "select AccountID, " + attrname + " from ADMIN";
        if (attrvalue !== undefined){
            if (isNaN(Number(attrvalue))) {
                sql = "select AccountID, " + attrname + " from ADMIN where " + attrname + "='" + attrvalue + "'";
            } else {
                sql = "select AccountID, " + attrname + " from ADMIN where " + attrname + "=" + attrvalue;
            }
        }
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("checkInADMIN");
                throw err;
            }
            else {
                let results = [];
                for (let elem of rows) {
                    let tmp = {};
                    tmp["adminID"] = elem['AccountID'];
                    tmp["email"] = elem['Email'];
                    results.push(tmp);
                }
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("checkInADMIN");
                    console.log(results);
                }
                dic[key] = results
                resolve();
            }
        });
    });
};
exports.checkInADMIN = checkInADMIN;

// identify user. We make email unique.
var identifyUser = function(dic, key, password, admins, customers) {
    return new Promise((resolve, reject) => {
        if (admins.length > 0) {
            h.compare(password, admins[0]["password"], (flag) => {
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("identifyUser");
                    console.log(admins[0]);
                }
                if (flag) {
                    dic[key] = admins[0];
                } else {
                    dic[key] = undefined;
                }
                resolve();
            })
        } else if (customers.length > 0) {
            h.compare(password, customers[0]["password"], (flag) => {
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("identifyUser");
                    console.log(customers[0]);
                }
                if (flag) {
                    dic[key] = customers[0];
                } else {
                    dic[key] = undefined;
                }
                resolve();
            })
        } else {
            if (g.logLevel <= g.Level.DEVELOPING) {
                console.log("identifyUser");
                console.log(undefined);
            }
            dic[key] = undefined;
            resolve();
        }
    });
};
exports.identifyUser = identifyUser;

// check password
var checkPassword = function(dic, key, input, user) {
    return new Promise((resolve, reject) => {
        let sql = "select Password from CUSTOMER where Email='" + user["email"] + "'";
        if (user["category"] === "admin") {
            sql = "select Password from ADMIN where Email='" + user["email"] + "'";
        }
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("checkPassword");
                throw err;
            }
            else {
                if (rows.length > 0) {
                    h.compare(input, rows[0]['Password'], (flag) => {
                        dic[key] = false;
                        if (g.logLevel <= g.Level.DEVELOPING) {
                            console.log("checkPassword");
                            console.log(dic[key]);
                        }
                        resolve();
                    })
                } else {
                    dic[key] = false;
                    if (g.logLevel <= g.Level.DEVELOPING) {
                        console.log("checkPassword");
                        console.log(dic[key]);
                    }
                    resolve();
                }
            }
        });
    });
};
exports.checkPassword = checkPassword;

var getNextCustomerID = function(dic, key) {
    return new Promise((resolve, reject) => {
        let sql = "select AccountID from CUSTOMER order by AccountID ASC";
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("getNextCustomerID");
                throw err;
            }
            else {
                let newID = ADMINRESERVE + 1;  // save ids for admins
                for (let elem of rows) {
                    let _id = elem['AccountID'];
                    if (_id !== newID) {
                        break;
                    }
                    newID = newID + 1;
                }
                dic[key] = newID;
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("getNextCustomerID");
                    console.log(newID);
                }
                resolve();
            }
        });
    });
};
exports.getNextCustomerID = getNextCustomerID;

var createCustomer = function(dic, key, newID, email, username, password) {
    return new Promise((resolve, reject) => {
        h.hash(password, (hashed) => {
            let sql = "replace INTO CUSTOMER (AccountID, Email, UserName, Password) VALUES (" + newID + ", '" + email + "', '" + username + "', '" + hashed + "');";
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log("createCustomer");
                    throw err;
                }
                else {
                    console.log("test for replace#####");
                    console.log(rows);
                    let user = {
                        "category": "customer",
                        "customerID": newID,
                        "email": email,
                        "username": username,
                        "password": hashed,
                        "details": {
                            "firstName": null,
                            "lastName": null,
                            "dateOfBirth": null,
                            "payment": null,
                            "mailAddress": null,
                            "billAddress": null,
                            "phone": null,
                        }
                    };
                    dic[key] = user;
                    if (g.logLevel <= g.Level.DEVELOPING) {
                        console.log("createCustomer");
                        console.log(user);
                    }
                    resolve();
                }
            });
        });
    });
};
exports.createCustomer = createCustomer;

// change username
var updateUsername = function(dic, key, newUsername, user) {
    return new Promise((resolve, reject) => {
        let sql = "update CUSTOMER SET UserName='" + newUsername + "' where AccountID=" + user["customerID"];
        if (user["category"] === "admin") {
            sql = "update ADMIN SET UserName='" + newUsername + "' where AccountID=" + user["adminID"];
        }
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("updateUsername");
                throw err;
            }
            else {
                dic[key] = true;
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("updateUsername: " + dic[key]);
                }
                resolve();
            }
        });
    });
};
exports.updateUsername = updateUsername;

// change password
var updatePassword = function(dic, key, newPassword, user) {
    return new Promise((resolve, reject) => {
        h.hash(newPassword, (hashed) => {
            let sql = "update CUSTOMER SET Password='" + hashed + "' where AccountID=" + user["customerID"];
            if (user["category"] === "admin") {
                sql = "update ADMIN SET Password='" + hashed + "' where AccountID=" + user["adminID"];
            }
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log("updatePassword");
                    throw err;
                }
                else {
                    dic[key] = hashed;
                    if (g.logLevel <= g.Level.DEVELOPING) {
                        console.log("updatePassword: " + dic[key]);
                    }
                    resolve();
                }
            });
        });
    });
};
exports.updatePassword = updatePassword;

var updateAccountDetails = function(dic, key, newFName, newLName, newDob, newPhone, user) {
    return new Promise((resolve, reject) => {
        let sql = "update CUSTOMER SET Fname='" + newFName + "', Lname='" + newLName + "', DateOfBirth='" + newDob + "', Phone='" + newPhone + "' where AccountID=" + user["customerID"];
        if (user["category"] === "admin") {
            sql = "update ADMIN SET Fname='" + newFName + "', Lname='" + newLName + "', DateOfBirth=" + newDob + ", Phone='" + newPhone + "' where AccountID=" + user["customerID"];
        }
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("updateAccountDetails");
                throw err;
            }
            else {
                dic[key] = true;
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("updateAccountDetails: " + dic[key]);
                }
                resolve();
            }
        });
    });
}
exports.updateAccountDetails = updateAccountDetails;

var updatePaymentMethods = function(dic, key, newCard, newEDate, newSCode, user) {
    return new Promise((resolve, reject) => {
        let sql = "update CUSTOMER SET Card='" + newCard + "', ExpDate='" + newEDate + "', SecCode='" + newSCode + "' where AccountID=" + user["customerID"];
        if (user["category"] === "admin") {
            sql = "update ADMIN SET Card='" + newCard + "', ExpDate='" + newEDate + "', SecCode='" + newSCode + "' where AccountID=" + user["customerID"];
        }
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("updatePaymentMethods");
                throw err;
            }
            else {
                dic[key] = true;
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("updatePaymentMethods: " + dic[key]);
                }
                resolve();
            }
        });
    });
}
exports.updatePaymentMethods = updatePaymentMethods;

var updateDeliveryAddress = function(dic, key, newStreet, newCity, newZip, newState, user) {
    return new Promise((resolve, reject) => {
        let sql = "update CUSTOMER SET Street='" + newStreet + "', City='" + newCity + "', Zip='" + newZip + "', State='" + newState + "' where AccountID=" + user["customerID"];
        if (user["category"] === "admin") {
            sql = "update ADMIN SET Street='" + newStreet + "', City='" + newCity + "', Zip='" + newZip + "', State='" + newState + "' where AccountID=" + user["customerID"];
        }
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("updateDeliveryAddress");
                throw err;
            }
            else {
                dic[key] = true;
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("updateDeliveryAddress: " + dic[key]);
                }
                resolve();
            }
        });
    });
}
exports.updateDeliveryAddress = updateDeliveryAddress;

var updateLastTwo = function(dic, key, newCard, newEDate, newSCode, newStreet, newCity, newZip, newState, user) {
    return new Promise((resolve, reject) => {
        let sql = "update CUSTOMER SET Card='" + newCard + "', ExpDate='" + newEDate + "', SecCode='" + newSCode + "', Street='" + newStreet + "', City='" + newCity + "', Zip='" + newZip + "', State='" + newState + "' where AccountID=" + user["customerID"];
        if (user["category"] === "admin") {
            sql = "update ADMIN SET Card='" + newCard + "', ExpDate='" + newEDate + "', SecCode='" + newSCode + "', Street='" + newStreet + "', City='" + newCity + "', Zip='" + newZip + "', State='" + newState + "' where AccountID=" + user["customerID"];
        }
        db.query(sql, (err, rows) => {
            if (err) {
                console.log("updateLastTwo");
                throw err;
            }
            else {
                dic[key] = true;
                if (g.logLevel <= g.Level.DEVELOPING) {
                    console.log("updateLastTwo: " + dic[key]);
                }
                resolve();
            }
        });
    });
}
exports.updateLastTwo = updateLastTwo;


