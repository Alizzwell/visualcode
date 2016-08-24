var express = require('express');
var router = express.Router();

var model = {
  User: require('../data/models/user'),
  Canvas: require('../data/models/canvas')
}


router.get('/', function (req, res, next) {
  model.Canvas
  .find({_owner: req.cookies.id})
  .select('_id title updateDate')
  .sort({updateDate: -1})
  .exec(function (err, data) {
    if (err) return next(err);
    res.status(200).json(data);
  });
});


router.post('/', function (req, res, next) {
  if (req.body._id || req.body.id) {
    return res.status(400).end();
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

      res.status(201).json(canvas);
    });    
  });
});


router.get('/:id', function (req, res, next) {
  model.Canvas
  .findOne({_id: req.params.id})
  .exec(function (err, data) {
    if (err) {
      return next(err);
    }

    if (!data) {
      return res.status(404).end();
    }

    if (data._owner != req.cookies.id) {
      return res.status(401).end();
    }
    
    res.status(200).json(data);
  });
});


router.put('/:id', function (req, res, next) {
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


router.delete('/:id', function (req, res, next) {
  if (!req.cookies.id) {
    return res.status(401).end();
  }

  model.Canvas
  .remove({
    _id: req.params.id,
    _owner: req.cookies.id
  })
  .exec(function (err, result) {
    if (err) return next(err);

    if (result.result.n == 0) {
      return res.status(401).end();
    }

    res.status(205);

    model.User
    .update({
      _id: req.cookies.id
    }, {
      $pull: {userCanvas: req.params.id}
    })
    .exec(function (err, result) {
      if (err) {
        return res.end();
      }
      res.status(204).end();
    });
    
  });
});


module.exports = router;
