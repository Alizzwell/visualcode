'use strict';

var express = require('express');
var async = require('async');
var fs = require('fs');
var exec = require('child_process').exec;
var router = express.Router();

var Canvas = require('../data/models/canvas');


router.get('/', function (req, res, next) {
  Canvas
  .find({_owner: req.session.user._id})
  .select('_id title updateDate')
  .sort({updateDate: -1})
  .exec(function (err, data) {
    if (err) { return next(err); }
    res.status(200).json(data);
  });
});


router.get('/:id', function (req, res, next) {
  Canvas
  .findOne({
    _id: req.params.id,
    _owner: req.session.user._id
  })
  .exec(function (err, data) {
    if (err) { return next(err); }
    if (!data) {
      return res.status(404).end();
    }
    res.status(200).json(data);
  });
});


router.post('/', function (req, res, next) {
  if (req.body._id !== undefined) {
    delete req.body._id;
  }

  var canvas = new Canvas(req.body);
  canvas._owner = req.session.user._id;
  canvas.regDate = new Date();

  canvas.save(function (err) {
    if (err) { return next(err); }
    res.status(201).json(canvas);
  });
});


router.post('/upload', function (req, res) {
  var resData = req.body;
  var scriptFile = `${global.appRoot}/gdb-script.js`;
  var sourceFile = `${global.appRoot}/tmp/${req.cookies.id}.cpp`;
  var binaryFile = `${global.appRoot}/tmp/${req.cookies.id}.out`;
  var designFile = `${global.appRoot}/tmp/${req.cookies.id}.json`;
  var inputFile = `${global.appRoot}/tmp/${req.cookies.id}.txt`;

  async.waterfall([
    function (callback) {
      fs.writeFile(sourceFile, req.body.code, callback);
    },
    function (callback) {
      exec(`g++ -g ${sourceFile} -o ${binaryFile}`, callback);
    },
    function (stdout, stderr, callback) {
      fs.writeFile(designFile, JSON.stringify(req.body.design), callback);
    },
    function (callback) {
      if (!req.body.input) {
        return callback();
      }
      fs.writeFile(inputFile, req.body.input, callback);
    },
    function (callback) {
      exec(`node ${scriptFile} ${sourceFile} ${binaryFile} `
        + `${designFile} ${inputFile}`, callback);
    },
    function (stdout) {
      resData.result = JSON.parse(stdout);
      res.status(201).json(resData);
    }
  ], function (err) {
    throw err;
  });
});


router.post('/:id', function (req, res, next) {
  var canvas = new Canvas(req.body);
  canvas._id = req.params.id;
  canvas.updateDate = new Date();

  Canvas
  .findOneAndUpdate({
    _id: canvas._id,
    _owner: req.session.user._id
  }, 
  {$set: canvas},
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
  Canvas
  .findOneAndRemove({
    _id: req.params.id,
    _owner: req.session.user._id
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
