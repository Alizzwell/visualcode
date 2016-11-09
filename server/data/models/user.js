'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  regDate: {type: Date, default: Date.now},
  authKey: {type: String, unique: true}
}, {versionKey: false});


module.exports = mongoose.model('User', userSchema);
