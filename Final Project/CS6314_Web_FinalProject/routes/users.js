var express = require('express');
var router = express.Router();

var g = require('../modules/globals');
var mu = require('../modules/m_user');
var mf = require('../modules/m_favorite');

router.get('/', function(req, res) {
	let user = mu.resolveUser(req.session.user);
	if (g.logLevel <= g.Level.DEBUGGING) {
		console.log("Show user details. 'user':");
        g.selectedPrint(mu.resolveUser(req.session.user));
    }
    res.render('user', {
    	"user": user,
    	"bfavorite": req.session.bfavorite,
    	"carousel": req.session.carousel,
    });
});

// sign in
router.post('/signin', function(req, res) {
	let email = req.body.emailx;
	let password = req.body.pwdx;
	if (!email || !password) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post users/signin");
        }
        res.send("Unvalid input in post users/signin");
	} else {
		let asyncFunc = async (email, password) => {
			let results = {}
			let p1 = await mu.getCustomers(results, "customers", email);
			let p2 = await mu.getAdmins(results, "admins", email);
			let customers = results["customers"];
			let admins = results["admins"];
			let p3 = await mu.identifyUser(results, "user", password, customers, admins);
			// only customer's favorite will be saved in database
			if (results["user"] !== undefined && results["user"]["category"] == "customer") {
				let customerID = results["user"]["customerID"];
				let p4 = await mf.getBriefFavorite(results, "bfavorite", customerID);
			}
			return Promise.resolve(results);
		}
		asyncFunc(email, password).then((results) => {
			req.session.user = results["user"];
			if (results["bfavorite"]) {
				req.session.bfavorite = results["bfavorite"];
			}
			req.session.save();
			if (g.logLevel <= g.Level.OPERATING) {
				if (req.session.user === undefined || req.session.user["category"] === "anonymous") {
					console.log("Sign in failed.");
				} else {
					console.log("Sign in as " + req.session.user["category"] + ".");
				}
	            g.selectedPrint(mu.resolveUser(req.session.user));
	        }
	        if (g.logLevel <= g.Level.DEBUGGING) {
				g.selectedPrint(results);
	        }
	        res.redirect('/products');
		})
	}
});

// check if email already existed
router.post('/check/email', function(req, res) {
	let email = req.body.email;
	if (!email) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post users/check/email");
        }
        res.send("Unvalid input in post users/check/email");
	} else {
		let asyncFunc = async (email) => {
			let results = {}
			let p1 = await mu.checkInCUSTOMER(results, "emailsInC", "Email", email);
			let p2 = await mu.checkInADMIN(results, "emailsInA", "Email", email);
			return Promise.resolve(results);
		}
		asyncFunc(email).then(results => {
			let c = results["emailsInC"];
	        let a = results["emailsInA"];
	        if (a.length > 0) {
	        	if (g.logLevel <= g.Level.OPERATING) {
	                console.log("Email already existed in admins");
	                console.log(a);
	            }
	            res.send("Email already existed in customers");
	        } else if (c.length > 0) {
	        	if (g.logLevel <= g.Level.OPERATING) {
	                console.log("Email already existed in customers");
	                console.log(c);
	            }
	            res.send("Email already existed in customers");
	        } else {
	        	if (g.logLevel <= g.Level.OPERATING) {
	                console.log("Email available");
	            }
	        	res.send("Email available");
	        }
		})
	}
});

// check if username already existed
router.post('/check/username', function(req, res) {
	let username = req.body.username;
	console.log(req.body.function);
	console.log(req.body.other);
	if (!username) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post users/check/username");
        }
        res.send("Unvalid input in post users/check/username");
	} else {
		let asyncFunc = async (username) => {
			let results = {}
			let p1 = await mu.checkInCUSTOMER(results, "usernameInC", "UserName", username);
			let p2 = await mu.checkInADMIN(results, "usernameInA", "UserName", username);
			return Promise.resolve(results);
		}
		asyncFunc(username).then(results => {
			let c = results["usernameInC"];
	        let a = results["usernameInA"];
	        if (a.length > 0) {
	        	if (g.logLevel <= g.Level.OPERATING) {
	                console.log("Username already existed in admins");
	                console.log(a);
	            }
	            res.send("Username already existed in admins");
	        } else if (c.length > 0) {
	        	if (g.logLevel <= g.Level.OPERATING) {
	                console.log("Username already existed in customers");
	                console.log(c);
	            }
	            res.send("Username already existed in customers");
	        } else {
	        	if (g.logLevel <= g.Level.OPERATING) {
	                console.log("Username available");
	            }
	        	res.send("Username available");
	        }
		})
	}
});

// check if input password fits original password in database
router.post('/check/password', function(req, res) {
	let input = req.body.password;
	let user = mu.resolveUser(req.session.user);
	if (!input) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post users/check/password");
        }
        res.send("Unvalid input in post users/check/password");
	} else if (user["category"] == "anonymous") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Guest has not password");
        }
        res.send("Guest has not password");
	} else {
		let asyncFunc = async (input, user) => {
			let results = {}
			let p1 = await mu.checkPassword(results, "flag", input, user);
			return Promise.resolve(results);
		}
		asyncFunc(input, user).then(results => {
			if (results["flag"]) {
				if (g.logLevel <= g.Level.DEVELOPING) {
	                console.log("Compare password with " + input + " success");
	            }
	            res.send("Compare password with " + input + " success");
			} else {
				if (g.logLevel <= g.Level.DEVELOPING) {
	                console.log("Compare password with " + input + " fail");
	            }
	            res.send("Compare password with " + input + " fail");
			}
		})
	}
});

router.post('/signup', function(req, res) {
	let email = req.body.email;
	let username = req.body.userName;
	let password = req.body.pwd;
	if (!email || !username || !password) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post users/signup");
        }
        res.send("Unvalid input in post users/signup");
	} else {
		let asyncFunc = async (email, username, password) => {
			let exists = {}
			let p1 = await mu.checkInCUSTOMER(exists, "emailsInC", "email", email);
			let p2 = await mu.checkInADMIN(exists, "emailsInA", "email", email);
			let p3 = await mu.checkInCUSTOMER(exists, "usernamesInC", "username", username);
			let p4 = await mu.checkInADMIN(exists, "usernameInA", "username", username);
			if (exists["emailsInC"].length > 0 ||
				exists["emailsInA"].length > 0 ||
				exists["usernamesInC"].length > 0 ||
				exists["usernameInA"].length > 0) {
				return Promise.reject(exists);
			}
			let results = {};
			let p5 = await mu.getNextCustomerID(results, "newID");
			let newID = results["newID"];
			let p6 = await mu.createCustomer(results, "newCustomer", newID, email, username, password);
			return Promise.resolve(results);
		}
		asyncFunc(email, username, password).then(results => {
			let newCustomer = results["newCustomer"];
	    	req.session.user = newCustomer;
	    	if (!req.session.bfavorite) {
	    		req.session.bfavorite = {};
	    	}
	    	req.session.save();
	    	if (g.logLevel <= g.Level.OPERATING) {
	            console.log("Sign up as customer.");
	            g.selectedPrint(mu.resolveUser(req.session.user));
	        }
	        if (g.logLevel <= g.Level.DEBUGGING) {
				g.selectedPrint(results);
	        }
	        res.redirect('/products');
	    }, (exists) => {  // sign up fail, set user to anonymous
			if (g.logLevel <= g.Level.OPERATING) {
	            console.log("Sign up failed.");
	            g.selectedPrint(mu.resolveUser(req.session.user));
	        }
	        if (g.logLevel <= g.Level.DEBUGGING) {
				g.selectedPrint(results);
	        }
	        res.redirect('/products');
		});
	}
});

router.post('/signout', function(req, res) {
	req.session.user = undefined;
	req.session.save();
    if (g.logLevel <= g.Level.OPERATING) {
		console.log("Sign out.");
        g.selectedPrint(mu.resolveUser(req.session.user));
    }
    res.redirect('/products');
});

router.post('/update/username', function(req, res) {
	let newUsername = req.body.newUsn;
	let user = mu.resolveUser(req.session.user);
	if (!newUsername) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post users/update/username");
        }
        res.send("Unvalid input in post users/update/username");
	} else if (user["category"] == "anonymous") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Guest has not username");
        }
        res.send("Guest has not username");
	} else {
		let asyncFunc = async (newUsername, user) => {
			let exists = {}
			let p1 = await mu.checkInCUSTOMER(exists, "usernamesInC", "username", newUsername);
			let p2 = await mu.checkInADMIN(exists, "usernameInA", "username", newUsername);
			if (exists["usernamesInC"].length > 0 ||
				exists["usernameInA"].length > 0) {
				return Promise.reject(exists);
			}
			let results = {};
			let p3 = await mu.updateUsername(results, "state", newUsername, user);
			return Promise.resolve(results);
		}
		asyncFunc(newUsername, user).then(results => {
			if (results["state"]) {
	        	if (g.logLevel <= g.Level.DEBUGGING) {
		            console.log("Change username to " + newUsername + " success");
		        }
		        req.session.user["username"] = newUsername;
		        req.session.save();
	        	res.send("Change username to " + newUsername + " success");
	        } else {
	        	if (g.logLevel <= g.Level.DEBUGGING) {
		            console.log("Change username to " + newUsername + " fail");
		        }
	        	res.send("Change username to " + newUsername + " fail");
	        }
	    }, (exists) => {  // sign up fail, set user to anonymous
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Fail for username existed");
	        }
	        res.send("Fail for username existed");
		});
	}
});

router.post('/update/password', function(req, res) {
	let newPassword = req.body.newPwd;
	let user = mu.resolveUser(req.session.user);
	if (!newPassword) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post users/update/password");
        }
        res.send("Unvalid input in post users/update/password");
	} else if (user["category"] == "anonymous") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Guest has not password");
        }
        res.send("Guest has not password");
	} else {
		let asyncFunc = async (newPassword, user) => {
			let results = {}
			let p1 = await mu.updatePassword(results, "hashed", newPassword, user);
			return Promise.resolve(results);
		}
		asyncFunc(newPassword, user).then(results => {
			if (results["state"]) {
	        	if (g.logLevel <= g.Level.DEBUGGING) {
		            console.log("Change password to " + newPassword + " success");
		        }
		        req.session.user["password"] = results["hashed"];
		        req.session.save();
	        	res.send("Change password to " + newPassword + " success");
	        } else {
	        	if (g.logLevel <= g.Level.DEBUGGING) {
		            console.log("Change password to " + newPassword + " fail");
		        }
	        	res.send("Change password to " + newPassword + " fail");
	        }
		})
	}
});

router.post('/update/account', function(req, res) {
	console.log("account");
	let newFName = req.body.firstName;
	let newLName = req.body.lastName;
	let newDob = req.body.dateOfBirth;
	let newPhone = req.body.phoneNumber.replace(/\s/g, '');
	let user = mu.resolveUser(req.session.user);
	if (!newFName || !newLName || !newDob || !newPhone) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post users/update/account");
        }
        res.send("Unvalid input in post users/update/account");
	} else if (user["category"] == "anonymous") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Guest has not account details");
        }
        res.send("Guest has not account details");
	} else {
		let asyncFunc = async (newFName, newLName, newDob, newPhone, user) => {
			let results = {}
			let p1 = await mu.updateAccountDetails(results, "state", newFName, newLName, newDob, newPhone, user);
			return Promise.resolve(results);
		}
		asyncFunc(newFName, newLName, newDob, newPhone, user).then(results => {
			if (results["state"]) {
	        	if (g.logLevel <= g.Level.DEBUGGING) {
		            console.log("Update account details success");
		        }
		        req.session.user["details"]["firstName"] = newFName;
		        req.session.user["details"]["lastName"] = newLName;
		        req.session.user["details"]["dateOfBirth"] = newDob;
		        req.session.user["details"]["phone"] = newPhone;
		        req.session.save();
	        	res.send("Update account details success");
	        } else {
	        	if (g.logLevel <= g.Level.DEBUGGING) {
		            console.log("Update account details fail");
		        }
	        	res.send("Update account details fail");
	        }
		})
	}
});

router.post('/update/payment', function(req, res) {
	let newCard = req.body.cardNumber.replace(/\s/g, '');
	let newEDate = req.body.expirationDate;
	let newSCode = req.body.securityCode;
	let user = mu.resolveUser(req.session.user);
	if (!newCard || !newEDate || !newSCode) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post users/update/payment");
        }
        res.send("Unvalid input in post users/update/payment");
	} else if (user["category"] != "customer") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only customers have payment methods");
        }
        res.send("Only customers have payment methods");
	} else {
		let asyncFunc = async (newCard, newEDate, newSCode, user) => {
			let results = {}
			let p1 = await mu.updatePaymentMethods(results, "state", newCard, newEDate, newSCode, user);
			return Promise.resolve(results);
		}
		asyncFunc(newCard, newEDate, newSCode, user).then(results => {
			if (results["state"]) {
	        	if (g.logLevel <= g.Level.DEBUGGING) {
		            console.log("Update payment methods success");
		        }
		        req.session.user["details"]["card"] = newCard;
		        req.session.user["details"]["expDate"] = newEDate;
		        req.session.user["details"]["secCode"] = newSCode;
		        req.session.save();
	        	res.send("Update payment methods success");
	        } else {
	        	if (g.logLevel <= g.Level.DEBUGGING) {
		            console.log("Update payment methods fail");
		        }
	        	res.send("Update payment methods fail");
	        }
		})
	}
});

router.post('/update/address', function(req, res) {
	let newStreet = req.body.streetAddress;
	let newCity = req.body.infoCity;
	let newZip = req.body.infoZip;
	let newState = req.body.infoState;
	let user = mu.resolveUser(req.session.user);
	if (!newStreet || !newCity || !newZip || !newState) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post users/update/address");
        }
        res.send("Unvalid input in post users/update/address");
	} else if (user["category"] != "customer") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only customers have delivery address");
        }
        res.send("Only customers have delivery address");
	} else {
		let asyncFunc = async (newStreet, newCity, newZip, newState, user) => {
			let results = {}
			let p1 = await mu.updateDeliveryAddress(results, "state", newStreet, newCity, newZip, newState, user);
			return Promise.resolve(results);
		}
		asyncFunc(newStreet, newCity, newZip, newState, user).then(results => {
			if (results["state"]) {
	        	if (g.logLevel <= g.Level.DEBUGGING) {
		            console.log("Update delivery address success");
		        }
		        req.session.user["details"]["street"] = newStreet;
		        req.session.user["details"]["city"] = newCity;
		        req.session.user["details"]["zip"] = newZip;
		        req.session.user["details"]["state"] = newState;
		        req.session.save();
	        	res.send("Update delivery address success");
	        } else {
	        	if (g.logLevel <= g.Level.DEBUGGING) {
		            console.log("Update delivery address fail");
		        }
	        	res.send("Update delivery address fail");
	        }
		})
	}
});


module.exports = router;
