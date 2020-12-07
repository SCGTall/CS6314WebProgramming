var express = require('express');
var router = express.Router();

var g = require('../modules/globals');
var mu = require('../modules/m_user');
var mp = require('../modules/m_products');
var mo = require('../modules/m_order');

router.get('/', function(req, res) {
	let user = mu.resolveUser(req.session.user);
	if (user["category"] != "customer") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only customers have orders");
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
			let p1 = await mp.getProducts(results, "products");
			let p2 = await mp.addCategories(results, "products");
			let p3 = await mo.getOrderDetails(results, "orderDetails")
			let p4 = await mo.getOrders(results, "orders", customerID);
			let products = results["products"];
			let orderDetails = results["orderDetails"]
			let p5 = await mo.fillProductsInOrders(results, "orders", products, orderDetails);
			return Promise.resolve(results);
		}
		asyncFunc(user).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Show all orders. 'orders':");
	            g.selectedPrint(results);
	        }
	        res.render('orders', results);
		})
	}
});

router.get('/:id', function(req, res) {
	let orderID = req.params.id;
	let user = mu.resolveUser(req.session.user);
	if (isNaN(Number(orderID))) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in get order/:id");
        }
		res.redirect('/orders');
	} else if (user["category"] != "customer") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only customers have orders");
        }
		res.redirect('/orders');
	} else {
		let asyncFunc = async (user, orderID) => {
			let customerID = user["customerID"];
			let results = {
				"user" : user,
				"bfavorite": req.session.bfavorite,
    			"carousel": req.session.carousel,
			};
			let p1 = await mp.getProducts(results, "products");
			let p2 = await mp.addCategories(results, "products");
			let p3 = await mo.getOrderDetails(results, "orderDetails")
			let p4 = await mo.getOrders(results, "orders", customerID);
			if (results["orders"].hasOwnProperty(orderID)) {  // if id not found
				results["order"] = results["orders"][orderID];
			} else {
				results["order"] = mo.EMPTYORDER;
			}
			let products = results["products"];
			let orderDetails = results["orderDetails"]
			let p5 = await mo.fillProductsInOrders(results, "order", products, orderDetails);
			return Promise.resolve(results);
		}
		asyncFunc(user, orderID).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Show a orders. 'tbd':");
	            g.selectedPrint(results);
	        }
	        res.render('tbd', results);
		})
	}
});

router.post('/:id/comment', function(req, res) {
	let comments = req.body.comments;
	let orderID = req.params.id;
	let user = mu.resolveUser(req.session.user);
	if (isNaN(Number(orderID)) || !comments) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in get order/:id/comment");
        }
        res.send("Unvalid input in get order/:id/comment");
	} else if (user["category"] != "customer") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only customers can comment");
        }
        res.send("Only customers can comment");
	} else {
		let asyncFunc = async (ord, comments) => {
			let results = {}
			let p1 = await msc.updateComment(results, "comments", oid, comment);
			return Promise.resolve(results);
		}
		asyncFunc(oid, comments).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Comments.");
	            g.selectedPrint(results);
	        }
	        res.redirect('/orders/' + orderID); 
		})
	}
});

module.exports = router;
