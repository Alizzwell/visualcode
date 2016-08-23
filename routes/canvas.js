var express = require('express');
var router = express.Router();

var model = {
  User: require('../data/models/user'),
  Canvas: require('../data/models/canvas')
}


router.post('/', function (req, res, next) {
  if (!req.cookies.id) {
    return res.status(401).end();
  }

  req.body._owner = req.cookies.id;
  var canvas = new model.Canvas(req.body);

  canvas.save(function (err) {
    if (err) {
      return next(err);
    }

    model.User
    .update(
      {_id: canvas._owner}, 
      {$push: {userCanvas: canvas._id}})
    .exec(function (err, result) {
      if (err) {
        return next(err);
      }

      if (result.n == 0) {
        return res.status(401).end();
      }

      res.status(201).send(canvas);
    });    
  });
});


router.get('/:id', function (req, res, next) {
  model.Canvas.findOne({_id: req.params.id}, 
    function (err, data) {
      if (err) {
        return next(err);
      }
      res.status(200).json(data);
    });
});


module.exports = router;
