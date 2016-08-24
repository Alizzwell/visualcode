var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});


var Example = require('../data/models/example');

router.get('/api/examples', function (req, res, next) {
  Example.find().select('_id title').sort({regDate: 1})
  .exec(function (err, data) {
    if (err) return next(err);
    res.status(200).json(data);
  });
});


router.get('/api/examples/:id', function (req, res, next) {
  Example
  .findOne({_id: req.params.id}, {'_id': 0})
  .select('title code input structures breaks')
  .exec(function (err, data) {
    if (err) {
      return next(err);
    }

    if (!data) {
      return res.status(404).end();
    }
    
    res.status(200).json(data);
  });
});


var fs = require('fs');

router.get('/api/drawapis', function (req, res, next) {
  fs.readFile('data/draw-apis.json', 'utf8', function (err, data) {
    if (err) return next(err);
    res.json(JSON.parse(data));  
  });
});


module.exports = router;
