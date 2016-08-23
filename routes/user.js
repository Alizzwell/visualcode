var express = require('express');
var router = express.Router();

var model = {
  User: require('../data/models/user'),
  Canvas: require('../data/models/canvas')
}


router.post('/', function (req, res, next) {
  model.User.findOne({_id: req.cookies.id}, function (err, data) {
    if (data) {
      return res.status(304).end();
    }
    
    var user = new model.User();
    user.save(function (err) {
      if (err) {
        return next(err);
      }
      res.cookie('id', user._id)
      res.status(201).end();
    });
  });
});


router.get('/', function (req, res, next) {
  model.User
  .findOne({_id: req.cookies.id})
  .populate('userCanvas')
  .exec(function (err, data) {
    if (err) {
      return next(err);
    }
    res.status(200).json(data);
  });
});


module.exports = router;
