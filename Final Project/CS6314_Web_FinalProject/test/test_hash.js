var express = require('express');
var router = express.Router();
let db = require('../modules/database');
var h = require('../modules/hash');

const unhashedPwds = [
    "test",
    "Test1234",
    "Ad123450",
    "Wid678934",
    "Uyh123456",
    "Pjg341152"
]

const lastResult = {
    "test":"$2b$10$OevNVIaABJZn/n9FNolEiu681PDnwfsGsCGXzhlwHU91Ma4N7FkR.",
    "Test1234":"$2b$10$Ruzvn/MRrVPKLcLb5zBgT.g6d5d9x3Vyt4jyzE2JBxrQHQReN5l7e",
    "Ad123450":"$2b$10$OevNVIaABJZn/n9FNolEiurdtfyHnti/KKmuV6X488uXiIsBrDGgu",
    "Wid678934":"$2b$10$OevNVIaABJZn/n9FNolEiu.Urct5C5OsuBjai1sx4GMHVnUnQ1IZC",
    "Uyh123456":"$2b$10$OevNVIaABJZn/n9FNolEiufPFRtMIMll4ntHan9H9C2XbhkbSn/Yu",
    "Pjg341152":"$2b$10$OevNVIaABJZn/n9FNolEiue80xxPcdZtpN2zv7QwUTjZA3apuXy.K"
}

var getHashed = function() {
    return new Promise((resolve, reject) => {
        let results = {};
        for (let pwd of unhashedPwds) {
            h.hash(pwd, (hashed) => {
                results[pwd] = hashed;
            })
        }
        resolve(results);
    });
};

// sign in
router.get('/', function(req, res) {
    getHashed().then((results) => {
        res.send(results);
    })
});

module.exports = router;