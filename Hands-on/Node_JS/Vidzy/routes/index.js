var express = require('express');
var router = express.Router();

/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

var monk = require('monk');
var db = monk('localhost:27017/vidzy');

router.get('/', function(req, res, next) {
  res.redirect('./videos');
});

var buildQuery = async function(genre, title) {
	let promise = await new Promise((resolve, reject) => {
		let query = {};
		if (genre != null && genre != "") {
			query["genre"] = genre;
		}
		if (title != null && title != "") {
			query["title"] = {"$regex": title, "$options" : 'i'};
		}
		resolve(query);
	});
	return promise;
};

router.get('/videos', function(req, res) {
	var collection = db.get('videos');
	buildQuery(req.query.genre, req.query.title).then(query => {
		collection.find(query, function(err, videos){
	        if (err) throw err;
	        res.render('index', {
	        	videos: videos,
	        	lastGenre: req.query.genre,
	        	genres: ["SciFi", "Fantasy", "Drama"],
	        	LastTitle: req.query.title
	     	});
	    });
	});
    
});

// create video
router.get('/videos/new', function(reg, res){
	res.render('form', {
		title: "Add new video",
		action: "/videos",
		backtrack: "/",
		video: {
		    "_id" : undefined,
		    "title" : "",
		    "genre" : "",
		    "image" : "",
		    "description" : ""
		}
	});
});

// insert route
router.post('/videos', function(req, res){
	var collection = db.get('videos');
	collection.insert({
		title: req.body.title,
		genre: req.body.genre,
		image: req.body.image,
		description: req.body.desc
	}, function(err, video){
		if (err) throw err;
	  	res.redirect('./videos');
	});
});

// read video
router.get('/videos/:id', function(req, res) {
	var collection = db.get('videos');
	collection.findOne({ _id: req.params.id }, function(err, video){
		if (err) throw err;
	  	res.render('show', { video : video });
	});
});

// delete video
router.delete('/videos/:id', function(req, res){
	var collection = db.get('videos');
	collection.remove({ _id: req.params.id }, function(err, video){
		if (err) throw err;
	});
	res.redirect('/videos');
});

// edit video
router.get('/videos/:id/edit', function(req, res) {
    var collection = db.get('videos');
	collection.findOne({ _id: req.params.id }, function(err, video){
		if (err) throw err;
	  	res.render('form', {
			title: "Edit video",
			action: "/videos/" + req.params.id + "/edit",
			backtrack: "/videos/" + req.params.id,
			video: video
		});
	});
});

// update video
router.post('/videos/:id/edit', function(req, res){
    var collection = db.get('videos');
    collection.update({ _id: req.params.id },
    { $set:
      {
        title: req.body.title,
        genre: req.body.genre,
        image: req.body.image,
        description: req.body.desc
      }
    }, function(err, video){
        if (err) throw err;
        res.redirect('/videos/' + req.params.id);
        
    });
});


module.exports = router;
