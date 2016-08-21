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

module.exports = router;
