'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.model('Example', require('./canvas').schema);
