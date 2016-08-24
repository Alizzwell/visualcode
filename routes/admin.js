var express = require('express');
var router = express.Router();

var Example = require('../data/models/example');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('admin');
});



router.get('/api/examples', function (req, res, next) {
  Example.find().select('_id title').sort({regDate: 1})
  .exec(function (err, data) {
    if (err) return next(err);
    res.status(200).json(data);
  });
});


router.post('/api/examples', function (req, res, next) {
  var example = new Example(req.body);
  example.updateDate = new Date();
  Example.findOneAndUpdate({
    _id: example._id
  }, example, {
    upsert: true
  }, function (err, updated) {
    if (err) return next(err);
    if (updated) {
      return res.status(200).json(example);
    }
    res.status(201).json(example);
  });
});


router.get('/api/examples/:id', function (req, res, next) {
  Example
  .findOne({_id: req.params.id})
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


router.delete('/api/examples/:id', function (req, res, next) {
  Example
  .remove({
    _id: req.params.id
  })
  .exec(function (err, result) {
    if (err) return next(err);

    if (result.result.n == 0) {
      return res.status(304).end();
    }

    res.status(204).end();
  });
});



var fs = require('fs');

router.get('/api/drawapis', function (req, res) {
  fs.readFile('data/draw-apis.json', 'utf8', function (err, data) {
    if (err) throw err;
    res.json(JSON.parse(data));  
  });
});


module.exports = router;
