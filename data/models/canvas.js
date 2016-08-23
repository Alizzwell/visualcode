var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var structureSchema = new Schema({
  id: String,
  type: String
});


var apiParamSchema = new Schema({
  name: String,
  description: String,
  optional: {type: Boolean, default: false}
});


var apiSchema = new Schema({
  name: String,
  description: String,
  params: [apiParamSchema]
});


var darwSchema = new Schema({
  structure: structureSchema,
  api: apiSchema,
  data: Schema.Types.Mixed
});


var breakSchema = new Schema({
  line: Number,
  draws: [darwSchema],
});


var canvasSchema = new Schema({
  _owner: {type: Schema.Types.ObjectId, ref: 'User'},
  title: String,
  code: String,
  input: String,
  regDate: {type: Date, default: Date.now},
  updateDate: {type: Date, default: Date.now},
  structures: [structureSchema],
  breaks: [breakSchema]
});


module.exports = mongoose.model('Canvas', canvasSchema);