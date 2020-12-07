var express = require('express');
var router = express.Router();
var mu = require('../modules/m_user');

// 
router.get('/', function(req, res) {
    let user = mu.resolveUser(req.session.user);
    let dataframe = {
        "user": user,
        "bfavorite": req.session.bfavorite,
        "carousel": req.session.carousel,
    }
    res.status(200).render('orders', dataframe); 
});

module.exports = router;