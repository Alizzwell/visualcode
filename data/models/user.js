var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  date: {type: Date, default: Date.now},
  userCanvas: [{type: Schema.Types.ObjectId, ref: 'canvas'}]
});


module.exports = mongoose.model('users', userSchema);