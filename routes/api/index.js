var express = require('express');

var router = express.Router();
var user_model =new (require('../../models/User'))();
router.get('/', function(req, res) {
	
    res.jsonp({ success: 'Test Ok' });
});
//用户
var _user = require('./user');
router.use(_user);
//登录/退出
var _signin = require('./signin');
router.use(_signin);
//权限
var _auth = require('./auth');
router.use(_auth);
//关键字
var _keyword = require('./keyword');
router.use(_keyword);
module.exports = router;