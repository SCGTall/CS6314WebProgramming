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

var getVideos = function() {
	return new Promise((resolve, reject) => {
        var collection = db.get('videos');
        collection.find({}, function(err, videos){
	        if (err) throw err;
	        resolve(videos);
	    });
    });
}

var getGenres = function() {
	return new Promise((resolve, reject) => {
        var collection = db.get('videos');
        collection.distinct('genre', {}, function(err, genres){
	        if (err) throw err;
	        resolve(genres);
	    });
    });
}

var selectVideos = async function(videos, genre, title) {
	let promise = await new Promise((resolve, reject) => {
		let arr = [];
		videos.forEach((video) => {
			let flag = true;
			if (genre != undefined && genre != '' && genre != video.genre) {
				flag = false;
			}
			if (title != undefined && title != '') {
				let keywords = title.trim().toLowerCase().split(' ');
				for (let i = 0; i < keywords.length; i++) {
					if (flag && video.title.toLowerCase().search(keywords[i]) == -1) {
						flag = false;
					}
				}
			}
			if (flag) {
				arr.push(video);
			}
		})
		resolve(arr);
	});
	return promise;
};

router.get('/videos', function(req, res) {
	let promises = [];
	let lastGenre = req.query.genre;
	const lastTitle = req.query.title;
	promises.push(getVideos());
	promises.push(getGenres());
	Promise.all(promises).then(function(results) {
		selectVideos(results[0], lastGenre, lastTitle).then(selected => {
			res.render('index', {
	        	videos: selected,
	        	lastGenre: lastGenre,
	        	genres: results[1],
	        	lastTitle: lastTitle
	     	});
		})
	})
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
