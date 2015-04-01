'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var User = require('../api/user/user.model');
var Log = require('./log.js');

// Passport Configuration
require('./local/passport').setup(User, config);
require('./facebook/passport').setup(User, config);
require('./google/passport').setup(User, config);
require('./twitter/passport').setup(User, config);

var router = express.Router();

router.use('/', function(req, res) {
	var log=new Log();
	log.ip=req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	log.save();
	res.json({
		ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
	})
});
router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));
router.use('/twitter', require('./twitter'));
router.use('/google', require('./google'));

module.exports = router;
