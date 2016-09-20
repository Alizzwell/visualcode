'use strict';

var debug = require('debug')('worker');
var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost';
var dbname;
var db = mongoose.connection;
var retry;


db.on('connecting', function() {
  debug('connecting to MongoDB...');
});

db.on('error', function(error) {
  debug('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});

db.on('connected', function() {
  clearInterval(retry);
  debug('MongoDB connected!');
});

db.once('open', function() {
  debug('MongoDB connection opened!');
});

db.on('reconnected', function () {
  debug('MongoDB reconnected!');
});

db.on('disconnected', function() {
  debug('MongoDB disconnected!');
  clearInterval(retry);
  retry = setInterval(connect, 5000);
});

mongoose.reconnect = reconnect;

module.exports = function (_dbname) {
  dbname = _dbname;
  connect();
  return mongoose;
};

// module.exports = mongoose;


function connect() {
  mongoose.connect(dbURI + '/' + dbname, {server: {auto_reconnect: true}});
}

function reconnect() {
  mongoose.disconnect();
}
