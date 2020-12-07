var express = require('express');
var router = express.Router();

var g = require('../modules/globals');
var mu = require('../modules/m_user');
var mp = require('../modules/m_products');
var msc = require('../modules/m_shopcart');
var mo = require('../modules/m_order');

router.get('/', function(req, res) {
	let user = mu.resolveUser(req.session.user);
	if (user["category"] != "customer") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only customers have shopcart");
        }
		res.redirect('/products');
	} else {
		let asyncFunc = async (user) => {
			let customerID = user["customerID"];
			let results = {
				"user" : user,
				"bfavorite": req.session.bfavorite,
    			"carousel": req.session.carousel,
			};
			let p1 = await msc.getCart(results, "cart", customerID);
			let p2 = await mp.addCategories(results, "cart");
			let cart = results["cart"];
			let dob = user["details"]["dateOfBirth"];
			let p3 = await msc.getTotal(results, "summary", cart, dob);
			return Promise.resolve(results);
		}
		asyncFunc(user).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Show shopcart. 'shopcart':");
				g.selectedPrint(results);
			}
	        res.render('shopcart', results);
		})
	}
});

router.post('/add', function(req, res) {
	let pid = req.body.productID;
	let num = req.body.num;
	let user = mu.resolveUser(req.session.user);
	if (isNaN(Number(pid)) || isNaN(Number(num)) || num <= 0) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post shopcart/add");
        }
        res.send("Unvalid input in post shopcart/add");
	} else if (user["category"] != "customer") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only customers have shopcart");
        }
        res.send("Only customers have shopcart");
	} else {
		let asyncFunc = async (user, pid, num) => {
			let results = {}
			let cid = user["customerID"];
			let p1 = await msc.getCartNum(results, "cartNum", cid, pid);
			let total = Number(results["cartNum"]) + Number(num);
			let p2 = await msc.updateInCart(results, "state", cid, pid, total);
			results["total"] = total;
			let p3 = await msc.updateCartTable(results, "state2");
			return Promise.resolve(results);
		}
		asyncFunc(user, pid, num).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Add " + num + " product " + pid + "s to shopcart.");
	            g.selectedPrint(results);
	        }
	        res.redirect("/shopcart"); 
		})
	}
});

router.post('/update', function(req, res) {
	let pid = req.body.productID;
	let num = req.body.num;
	let user = mu.resolveUser(req.session.user);
	if (isNaN(Number(pid)) || isNaN(Number(num))) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post shopcart/update");
        }
        res.send("Unvalid input in post shopcart/update");
	} else if (user["category"] != "customer") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only customers have shopcart");
        }
        res.send("Only customers have shopcart");
	} else {
		let asyncFunc = async (user, pid, num) => {
			let results = {}
			let cid = user["customerID"];
			let p1 = await msc.getCartNum(results, "cartNum", cid, pid);
			let cartNum = results["cartNum"];
			let sum = Number(num) + Number(cartNum);
			if (sum > 0) {
				let p2 = await msc.updateInCart(results, "state", cid, pid, sum);
			} else {
				let p3 = await msc.removeFromCart(results, "state2", cid, pid);
			}
			let p4 = await msc.updateCartTable(results, "state3");
			return Promise.resolve(results);
		}
		asyncFunc(user, pid, num).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Update product " + pid + "s' number in shopcart to " + num + ".");
	            g.selectedPrint(results);
	        }
	        res.redirect('/shopcart');
		})
	}
});

router.post('/remove', function(req, res) {
	let pid = req.body.productID;
	let user = mu.resolveUser(req.session.user);
	if (isNaN(Number(pid))) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post shopcart/remove");
        }
        res.send("Unvalid input in post shopcart/remove");        res.send(false);
	} else if (user["category"] != "customer") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only customers have shopcart");
        }
        res.send("Only customers have shopcart");
	} else {
		let asyncFunc = async (user, pid) => {
			let results = {}
			let cid = user["customerID"];
			let p1 = await msc.removeFromCart(results, "state", cid, pid);
			let p2 = await msc.updateCartTable(results, "state2");
			return Promise.resolve(results);
		}
		asyncFunc(user, pid).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Remove product " + pid + " from shopcart.");
	            g.selectedPrint(results);
	        }
	        res.redirect('/shopcart');
		})
	}
});

router.get('/checkout', function(req, res) {
	let user = mu.resolveUser(req.session.user);
	if (user["category"] != "customer") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only customers can checkout");
        }
		res.redirect('/shopcart');
	} else {
		let asyncFunc = async (user) => {
			let customerID = user["customerID"];
			let results = {
				"user" : user,
				"bfavorite": req.session.bfavorite,
    			"carousel": req.session.carousel,
			};
			let p1 = await msc.getCart(results, "cart", customerID);
			let p2 = await mp.addCategories(results, "cart");
			let cart = results["cart"];
			let checkout = {};
			Object.keys(cart).forEach(function(productID) {
		        checkout[productID] = cart[productID];
		        if (cart["cartNum"] > cart["storeNum"]) {
		            checkout[productID]["cartNum"] = cart[productID]["storeNum"];
		        }
		    })
		    results["checkout"] = checkout;
		    let dob = user["details"]["dateOfBirth"];
		    let p3 = await msc.getTotal(results, "summary", checkout, dob);
			return Promise.resolve(results);
		}
		asyncFunc(user).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Checkout from cart. 'shopcart':");
	            g.selectedPrint(results);
	        }
	        res.render('checkout', results);
		})
	}
});

router.post('/checkout/pay', function(req, res) {
	let newCard = req.body.cardNumber.replace(/\s/g, '');
	let newEDate = req.body.expirationDate;
	let newSCode = req.body.securityCode;
	let newStreet = req.body.streetAddress;
	let newCity = req.body.infoCity;
	let newZip = req.body.infoZip;
	let newState = req.body.infoState;
	let user = mu.resolveUser(req.session.user);
	if (!newCard || !newEDate || !newSCode) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post checkout/pay");
        }
        res.send("Unvalid input in post checkout/pay");
	} else if (!newStreet || !newCity || !newZip || !newState) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in checkout/pay");
        }
        res.send("Unvalid input in checkout/pay");
	} else if (user["category"] != "customer") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only customers can checkout");
        }
        res.send("Only customers can checkout");
	} else {
		let asyncFunc = async (newCard, newEDate, newSCode, newStreet, newCity, newZip, newState, user) => {
			let results = {};
			let cid = user["customerID"];
			let p1 = await mu.updateLastTwo(results, "state", newCard, newEDate, newSCode, newStreet, newCity, newZip, newState, user);
			let p2 = await msc.getCart(results, "cart", cid);
			let p3 = await mp.addCategories(results, "cart");
			let cart = results["cart"];
			let purchase = {};
			Object.keys(cart).forEach(function(productID) {
		        if (cart[productID]["cartNum"] > cart[productID]["storeNum"]) {
		            purchase[productID] = cart[productID];
		        } else {
		        	purchase[productID] = cart[productID];
		        }
		    })
		    results["purchase"] = purchase;
		    let dob = user["details"]["dateOfBirth"];
		    let p4 = await msc.getTotal(results, "summary", purchase, dob);
		    let totalPrice = results["summary"];
			let p5 = await mp.sellProducts(results, "sell", purchase);
			let p6 = await mo.getNextOrderID(results, "newID");
			let newID = results["newID"];
			let p7 = await mo.newOrder(results, "state2", newID, cid, totalPrice, purchase);
			let p8 = await msc.deleteCart(results, "state3", cid);
			return Promise.resolve(results);
		}
		asyncFunc(newCard, newEDate, newSCode, newStreet, newCity, newZip, newState, user).then(results => {
			req.session.user["details"]["card"] = newCard;
	        req.session.user["details"]["expDate"] = newEDate;
	        req.session.user["details"]["secCode"] = newSCode;
	        req.session.user["details"]["street"] = newStreet;
	        req.session.user["details"]["city"] = newCity;
	        req.session.user["details"]["zip"] = newZip;
	        req.session.user["details"]["state"] = newState;
	        req.session.save();
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Payment issued. Have a nice day!");
	            g.selectedPrint(results);
	        }
	        res.redirect('/products');
		})
	}
});

module.exports = router;
