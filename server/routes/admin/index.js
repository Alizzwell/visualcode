'use strict';

var express = require('express');
var router = express.Router();

var User = require('../../data/models/user');


router.post('/login', function (req, res, next) {
  // var id = req.body.id;
  // var pw = req.body.pw;

  req.session.userType = 'admin';
  res.redirect('/');
});


module.exports = router;
