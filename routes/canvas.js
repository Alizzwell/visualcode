var express = require('express');
var router = express.Router();

var model = {
  User: require('../data/models/user'),
  Canvas: require('../data/models/canvas')
}


router.get('/', function (req, res, next) {
  if (!req.cookies.id) {
    return res.status(401).end();
  }

  model.Canvas
  .find({_owner: req.cookies.id})
  .sort({updateDate: -1})
  .exec(function (err, data) {
    if (err) return next(err);
    res.status(200).json(data);
  });
});


router.post('/', function (req, res, next) {
  if (!req.cookies.id) {
    return res.status(401).end();
  }

  var canvas = new model.Canvas(req.body);
  canvas._owner = req.cookies.id;

  canvas.save(function (err) {
    if (err) return next(err);

    model.User
    .update({
      _id: canvas._owner
    },{
      $push: {userCanvas: canvas._id}
    })
    .exec(function (err, result) {
      if (err) return next(err);

      if (result.n == 0) {
        return res.status(401).end();
      }

      res.status(201).send(canvas);
    });    
  });
});


router.put('/:id', function (req, res, next) {
  if (!req.cookies.id || req.cookies.id != req.body._owner) {
    return res.status(401).end();
  }

  if (!req.body._id) {
    return res.status(400).end();
  }

  var canvas = new model.Canvas(req.body);
  canvas.updateDate = new Date();

  model.Canvas
  .update({
    _id: canvas._id,
    _owner: req.cookies.id
  }, canvas)
  .exec(function (err, result) {
    if (err) return next(err);
    res.status(200).json(canvas);
  });

});


module.exports = router;
