var express = require('express');
var async = require('async');
var fs = require('fs');
var exec = require('child_process').exec;
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


router.post('/upload', function (req, res, next) {
  if (!req.cookies.id) {
    return res.status(401).end();
  }

  var resData = req.body;
  var sourceFile = `tmp/${req.cookies.id}.cpp`;
  var binaryFile = `tmp/${req.cookies.id}.out`;
  var designFile = `tmp/${req.cookies.id}.json`;
  var inputFile = `tmp/${req.cookies.id}.txt`;

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
      exec(`node gdb-script.js ${sourceFile} ${binaryFile} `
        + `${designFile} ${inputFile}`, callback);
    },
    function (stdout, stderr, callback) {
      resData.result = JSON.parse(stdout);
      res.status(201).json(resData);
    }
  ], function (err) {
    throw err;
  });
});


module.exports = router;
