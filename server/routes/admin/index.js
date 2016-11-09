'use strict';

var express = require('express');
var router = express.Router();


router.post('/login', function (req, res) {
  // var id = req.body.id;
  // var pw = req.body.pw;

  req.session.userType = 'admin';
  res.redirect('/');
});


module.exports = router;
