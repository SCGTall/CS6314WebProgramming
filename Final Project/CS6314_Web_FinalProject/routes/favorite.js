var express = require('express');
var router = express.Router();

var g = require('../modules/globals');
var mu = require('../modules/m_user');
var mp = require('../modules/m_products');
var mf = require('../modules/m_favorite');

router.get('/', function(req, res) {
	let user = mu.resolveUser(req.session.user);
	let bfavorite = req.session.bfavorite;
	if (bfavorite === undefined) {
		bfavorite = {};
	}
	if (user["category"] != "customer") {
		let asyncFunc = async (user, bfavorite) => {
			let customerID = user["customerID"];
			let results = {
				"user" : user,
				"bfavorite": bfavorite,
    			"carousel": req.session.carousel,
			};
			let p1 = await mp.getProductsByIDS(results, "favorite", bfavorite);
			let p2 = await mp.addCategories(results, "favorite");
			return Promise.resolve(results);
		}
		asyncFunc(user, bfavorite).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Show favorite (not a customer). 'favorite':");
	            g.selectedPrint(results);
	        }
	        res.render('favorite', results);
		})
	} else {
		let asyncFunc = async (user) => {
			let customerID = user["customerID"];
			let results = {
				"user" : user,
				"bfavorite": req.session.bfavorite,
    			"carousel": req.session.carousel,
			};
			let p1 = await mf.getFavorite(results, "favorite", customerID);
			let p2 = await mp.addCategories(results, "favorite");
			return Promise.resolve(results);
		}
		asyncFunc(user).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Show favorite. 'favorite':");
	            g.selectedPrint(results);
	        }
	        res.render('favorite', results);
		})
	}
});

router.post('/add', function(req, res) {
	let pid = req.body.productID;
	console.log(pid);
	let user = mu.resolveUser(req.session.user);
	if (isNaN(Number(pid))) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post favorite/add");
        }
		res.send("Unvalid input in post favorite/add");
	} else if (user["category"] != "customer") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only customers' favorite will be saved in database");
        }
    	if (!req.session.hasOwnProperty("bfavorite")) {
    		req.session.bfavorite = {};
    	}
        req.session.bfavorite[pid] = 0;
        req.session.save();
        res.redirect('/favorite');
	} else {
		let asyncFunc = async (user, pid) => {
			let results = {}
			let cid = user["customerID"];
			let p1 = await mf.addToFavorite(results, "state", cid, pid);
			let p2 = await mf.updateFavoriteTable(results, "state2");
			return Promise.resolve(results);
		}
		asyncFunc(user, pid).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Add product " + pid + " to favorite");
	            g.selectedPrint(results);
	        }
	        if (!req.session.hasOwnProperty("bfavorite")) {
	    		req.session.bfavorite = {};
	    	}
	        req.session.bfavorite[pid] = 0;
	        req.session.save();
	        res.redirect('/favorite');
		})
	}
});

router.post('/remove', function(req, res) {
	let pid = req.body.productID;
	let user = mu.resolveUser(req.session.user);
	if (isNaN(Number(pid))) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post favorite/remove");
        }
        res.send("Unvalid input in post favorite/remove");
	} else if (user["category"] != "customer") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only customers' favorite will be saved in database");
        }
        if (req.session.hasOwnProperty("bfavorite")) {
        	if (req.session.bfavorite.hasOwnProperty(pid)) {
        		delete req.session.user["bfavorite"][pid];
        	}
    	}
        req.session.save();
        res.redirect('/favorite');
	} else {
		let asyncFunc = async (user, pid) => {
			let results = {}
			let cid = user["customerID"];
			let p1 = await mf.removeFromFavorite(results, "state", cid, pid);
			let p2 = await mf.updateFavoriteTable(results, "state2");
			return Promise.resolve(results);
		}
		asyncFunc(user, pid).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Remove product " + pid + " from favorite");
	            g.selectedPrint(results);
	        }
	        console.log(req.session.bfavorite);
	        if (req.session.hasOwnProperty("bfavorite")) {
	        	if (req.session.bfavorite.hasOwnProperty(pid)) {
	        		delete req.session.bfavorite[pid];
	        	}
	    	}
	        req.session.save();
	        res.redirect('/favorite');
		})
	}
});

module.exports = router;
