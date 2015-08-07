var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dankstination' });
});

router.get('/map', function(req, res, next){
	res.render('map', { title: 'Dankstination'});
});

module.exports = router;
