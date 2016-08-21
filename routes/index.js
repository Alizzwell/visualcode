var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});




var fs = require('fs');

router.get('/api/examples', function (req, res) {
  fs.readFile('data/examples.json', 'utf8', function (err, data) {
    if (err) throw err;

    var examples = JSON.parse(data);
    res.json(examples.map(function (item) {
      return {
        id: item.id,
        title: item.title
      };
    }));  
  });
});

router.get('/api/examples/:id', function (req, res) {
  fs.readFile('data/examples.json', 'utf8', function (err, data) {
    if (err) throw err;

    var examples = JSON.parse(data);
    res.json(examples.find(function (item) {
      return item.id == req.params.id;
    }));
  });
});


router.get('/api/drawapis', function (req, res) {
  fs.readFile('data/draw-apis.json', 'utf8', function (err, data) {
    if (err) throw err;
    res.json(JSON.parse(data));  
  });
});


module.exports = router;
