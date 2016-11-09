'use strict';

var express = require('express');
var router = express.Router();

var Example = require('../data/models/example');


router.get('/', function (req, res, next) {
  Example
  .find()
  .select('_id title updateDate')
  .sort({regDate: 1})
  .exec(function (err, data) {
    if (err) { return next(err); }
    res.status(200).json(data);
  });
});


router.get('/:id', function (req, res, next) {
  var model;
  
  if (req.session.userType === 'user') {
    model = Example
    .findOne({_id: req.params.id}, {'_id': 0})
    .select('title code input structures breaks');
  }
  else if (req.session.userType === 'admin') {
    model = Example
    .findOne({_id: req.params.id});
  }

  model.exec(function (err, data) {
    if (err) { return next(err); }
    if (!data) {
      return res.status(404).end();
    }
    res.status(200).json(data);
  });
});


router.post('/', function (req, res, next) {
  if (req.session.userType !== 'admin') {
    return res.status(401).end();
  }

  if (req.body._id !== undefined) {
    delete req.body._id;
  }

  var example = new Example(req.body);
  example.regDate = new Date();

  example.save(function (err) {
    if (err) { return next(err); }
    res.status(201).json(example);
  });
});


router.post('/:id', function (req, res, next) {
  if (req.session.userType !== 'admin') {
    return res.status(401).end();
  }

  var example = new Example(req.body);
  example._id = req.params.id;
  example.updateDate = new Date();

  Example
  .findOneAndUpdate({
    _id: example._id
  }, 
  {$set: example},
  {'new': true})
  .exec(function (err, data) {
    if (err) { return next(err); }
    if (!data) {
      return res.status(404).end();
    }
    res.status(200).json(data);
  });
});


router.delete('/:id', function (req, res, next) {
  if (req.session.userType !== 'admin') {
    return res.status(401).end();
  }

  Example
  .findOneAndRemove({
    _id: req.params.id
  })
  .exec(function (err, data) {
    if (err) { return next(err); }
    if (!data) {
      return res.status(404).end();
    }
    res.status(204).end();
  });
});

module.exports = router;
