'use strict';

var express = require('express');
var router = express.Router();

var User = require('../data/models/user');


router.post('/login', function (req, res, next) {
  req.session.userType = req.session.userType || 'user';

  if (!req.cookies.authKey) {
    var user = new User();
    user.authKey = user._id;

    user.save(function (err) {
      if (err) { return next(err); }

      req.session.user = user;
      res.cookie('authKey', user.authKey, 
        {expires: new Date(Date.now() + 315360000000)});
      
      res.status(200).end(req.session.userType);
    });

    return;
  }

  User
  .findOne({authKey: req.cookies.authKey})  
  .exec(function (err, data) {
    if (data) {
      req.session.user = data;
      res.cookie('authKey', data.authKey, 
        {expires: new Date(Date.now() + 315360000000)});
      
      return res.status(200).end(req.session.userType);
    }
    
    var user = new User();
    user.authKey = user._id;

    user.save(function (err) {
      if (err) { return next(err); }

      req.session.user = user;
      res.cookie('authKey', user.authKey, 
        {expires: new Date(Date.now() + 315360000000)});
      
      return res.status(200).end(req.session.userType);
    });
  });
});


router.post('/logout', function (req, res) {
  req.session = null;
  return res.status(204).end();
});


router.use('/examples', require('./examples'));
router.use('/canvas', require('./canvas'));


module.exports = router;
