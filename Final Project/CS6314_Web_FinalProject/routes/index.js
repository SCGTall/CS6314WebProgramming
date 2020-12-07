var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);  
    }
});
var upload = multer({ storage: storage });

var g = require('../modules/globals');
var mu = require('../modules/m_user');
var mp = require('../modules/m_products');
var mf = require('../modules/m_favorite');
var mo = require('../modules/m_order');

// root
router.get('/', function(req, res) {
	res.redirect('/products');
});

// show all products
router.get('/products', function(req, res) {
	let searchCategories = req.query.searchCategories;
	let searchText = req.query.searchText;
	if (searchCategories === undefined) {
		searchCategories = [];
	} else if (!Array.isArray(searchCategories)) {
		searchCategories = [searchCategories];
	}
	let searchKeywords = [];
	if (searchText !== undefined && searchText !== "") {
		searchKeywords = searchText.trim().toLowerCase().split(' ');
	}
	let user = mu.resolveUser(req.session.user);
	let asyncFunc = async (user, searchCategories, searchText) => {
		let results = {}
		let p1 = await mp.getProducts(results, "products");
		let p2 = await mp.addCategories(results, "products");
		let products = results["products"];
		let p3 = await mp.selectProducts(results, "selected", products, searchCategories, searchKeywords);
		let p4 = await mp.getCategories(results, "categories");
		results["lastCategories"] = searchCategories;
		results["lastSearchText"] = searchText;
		if (searchText === undefined) {
			results["lastSearchText"] = "";
		}
		let p5 = await mp.generateFilterString(results, "lastFilterString", searchCategories, searchKeywords, searchText);
		let categories = results["categories"];
		let p7 = await mo.findHotProducts(results, "hot");
		let hot = results["hot"];
		let p8 = await mp.selectCarousel(results, "carousel", products, categories, hot);
		return Promise.resolve(results);
	}
	asyncFunc(user, searchCategories, searchText).then(results => {
        // update carousel in session
		req.session.carousel = results["carousel"];
		if (!req.session.hasOwnProperty("bfavorite")) {
	    		req.session.bfavorite = {};
	    	}
		req.session.save();
        let dataframe = {
        	"user": user,
        	"bfavorite": req.session.bfavorite,
        	"carousel": req.session.carousel,
        	"selected": results["selected"],
        	"categories": results["categories"],
        	"products": results["products"],
        	"lastCategories": results["lastCategories"],
        	"lastSearchText": results["lastSearchText"],
        	"lastFilterString": results["lastFilterString"],
        	"lastSearchText": results["lastSearchText"],
        }
        if (g.logLevel <= g.Level.DEBUGGING) {
            console.log("Show products. 'index':");
            g.selectedPrint(dataframe);
        }
        if (g.logLevel <= g.Level.DEVELOPING) {
            g.selectedPrint(results);
		}
		console.log(results["bfavorite"]);
        res.render('index', dataframe); 
	})
});

// new product
router.get('/products/new', function(req, res) {
	let user = mu.resolveUser(req.session.user);
	if (user["category"] != "admin") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only admins can new product");
        }
		res.redirect('/products');
	} else {
		let asyncFunc = async (user) => {
			let results = {
				"user" : user,
				"bfavorite": req.session.bfavorite,
				"carousel": req.session.carousel,
			};
			let p1 = await mp.getCategories(results, "categories");
			return Promise.resolve(results);
		}
		asyncFunc(user).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Edit a new product. 'new':");
	        }
			res.render('new', results); 
		})
	}
});

// add product
router.post('/products/new/add', upload.single('image'), function(req, res) {
	let productName = req.body.productName;
	let categoriesStr = req.body.categories;
	let productPrice = req.body.productPrice;
	let description = req.body.description;
	let storeNum = req.body.storeNum;
	let file = req.file;
	let image = file === undefined ? "" : file.originalname;
	let user = mu.resolveUser(req.session.user);
	if (!productName || !categoriesStr || !description) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post products/new/add");
        }
        res.send("Unvalid input in post products/new/add");
	} else if (isNaN(Number(productPrice)) || isNaN(Number(storeNum))) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post products/new/add");
        }
        res.send("Unvalid input in post products/new/add");
	} else if (user["category"] != "admin") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only admins can new product");
        }
        res.send("Only admins can new product");
	} else {
		let categories = [];
		if (categoriesStr !== undefined && categoriesStr != "") {
			categories = categoriesStr.trim().split(', ');
		}
		let product = mp.EMPTYPRODUCT;
		product["productName"] = productName;
		product["categories"] = categories;
		product["productPrice"] = productPrice;
		product["description"] = description;
		product["image"] = image;
		product["storeNum"] = storeNum;
		product["visible"] = true;
		let asyncFunc = async (product, categories) => {
			let results = { "product" : product};
			let p1 = await mp.getCategories(results, "categories");
			let p2 = await mp.getNextProductID(results, "productID");
			let productID = results["productID"];
			results["product"]["productID"] = productID;
			let p3 = await mp.updateProduct(results, "state", productID, product);
			let allCategories = results["categories"];
			let p4 = await mp.relaxCategories(results, "state3", productID, product, categories, allCategories);
			return Promise.resolve(results);
			return Promise.resolve(results);
		}
		asyncFunc(product, categories).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Add a new product.:");
	            g.selectedPrint(results);
	        }
	        res.redirect('/products/' + results["productID"]); 
		})
	}
});

// show one product
router.get('/products/:id', function(req, res) {
	let productID = req.params.id;
	let user = mu.resolveUser(req.session.user);
	if (isNaN(Number(productID))) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in get products/:id");
        }
        res.redirect('/products');
	} else {
		let asyncFunc = async (user, productID) => {
			let results = {
				"user" : user,
				"bfavorite": req.session.bfavorite,
    			"carousel": req.session.carousel,
			};
			let p1 = await mp.getProducts(results, "products");
			let p2 = await mp.addCategories(results, "products");
			let p3 = await mp.getCategories(results, "categories");
			if (results["products"].hasOwnProperty(productID)) {  // if id not found
				results["product"] = results["products"][productID];
			} else {
				results["product"] = mp.EMPTYPRODUCT;
			}
			results["lastCategories"] = [];
			results["lastSearchText"] = "";
			results["lastFilterString"] = "";
			return Promise.resolve(results);
		}
		asyncFunc(user, productID).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Show a product. 'show':");
	            g.selectedPrint(results);
	        }
	        res.render('show', results); 
		})
	}
});

// show one product
router.get('/products/:id/edit', function(req, res) {
	let productID = req.params.id;
	let user = mu.resolveUser(req.session.user);
	if (isNaN(Number(productID))) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in get products/:id/edit");
        }
        res.redirect('/products/' + results["productID"]); 
	} else if (user["category"] != "admin") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only admins can edit product");
        }
		res.redirect('/products/' + results["productID"]); 
	} else {
		let asyncFunc = async (user, productID) => {
			let results = {
				"user" : user,
				"bfavorite": req.session.bfavorite,
    			"carousel": req.session.carousel,
			};
			let p1 = await mp.getProducts(results, "products");
			let p2 = await mp.addCategories(results, "products");
			let p3 = await mp.getCategories(results, "categories");
			results["product"] = results["products"][productID];
			results["user"] = user;
			results["lastCategories"] = [];
			results["lastSearchText"] = "";
			results["lastFilterString"] = "";
			return Promise.resolve(results);
		}
		asyncFunc(user, productID).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Edit a product. 'edit':");
	            g.selectedPrint(results);
	        }
	        res.render('edit', results); 
		})
	}
});

// update one product
router.post('/products/:id/edit/update', upload.single('image'), function(req, res) {
	let productID = req.params.id;
	let productName = req.body.productName;
	let categoriesStr = req.body.categories;
	let productPrice = req.body.productPrice;
	let description = req.body.description;
	let storeNum = req.body.storeNum;
	let file = req.file;
	let image = file === undefined ? undefined : file.originalname;
	let user = mu.resolveUser(req.session.user);
	if (!productName || !categoriesStr || !description) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post products/:id/edit/update");
        }
        res.send("Unvalid input in post products/:id/edit/update");
	} else if (isNaN(Number(productID)) || isNaN(Number(productPrice)) || isNaN(Number(storeNum))) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post products/:id/edit/update");
        }
        res.send("Unvalid input in post products/:id/edit/update");
	} else if (user["category"] != "admin") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only admins can edit product");
        }
        res.send("Only admins can edit product");
	} else {
		let categories = [];
		if (categoriesStr !== undefined && categoriesStr != "") {
			categories = categoriesStr.trim().split(', ');
		}
		let product = mp.EMPTYPRODUCT;
		product["productID"] = productID;
		product["productName"] = productName;
		product["categories"] = categories;
		product["productPrice"] = productPrice;
		product["description"] = description;
		product["image"] = image;
		product["storeNum"] = storeNum;
		product["visible"] = true;
		let asyncFunc = async (productID, product, image, categories) => {
			let results = { "product" : product};
			let p1 = await mp.getCategories(results, "categories");
			if (!image) {
				let p2 = await mp.keepOldImage(results, "product", "image", productID);
			}
			let p3 = await mp.updateProduct(results, "state2", productID, product);
			let allCategories = results["categories"];
			let p4 = await mp.relaxCategories(results, "state3", productID, product, categories, allCategories);
			return Promise.resolve(results);
		}
		asyncFunc(productID, product, image, categories).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Update a product:");
	            g.selectedPrint(results);
	        }
	        res.redirect('/products/' + productID);
		})
	}
});

// remove one product (soft delete)
router.post('/products/:id/edit/remove', function(req, res) {
	let productID = req.params.id;
	let user = mu.resolveUser(req.session.user);
	if (isNaN(Number(productID))) {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Unvalid input in post products/:id/edit/remove");
        }
        res.send("Unvalid input in post products/:id/edit/remove");
	} else if (user["category"] != "admin") {
		if (g.logLevel <= g.Level.OPERATING) {
            console.log("Only admins can edit product");
        }
        res.send("Only admins can edit product");
	} else {
		let asyncFunc = async (productID) => {
			let results = {};
			let p1 = await mp.deleteProduct(results, "state", productID);
			return Promise.resolve(results);
		}
		asyncFunc(productID).then(results => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Update a product:");
	            g.selectedPrint(results);
	        }
	        res.redirect('/products');
	    }, (func) => {
			if (g.logLevel <= g.Level.DEBUGGING) {
	            console.log("Update a product fail in " + func);
	        }
	        res.redirect('/products');
		});
	}
});

module.exports = router;
