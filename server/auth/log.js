'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
  ip: String,
  logtime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);
