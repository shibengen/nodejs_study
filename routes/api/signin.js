var express = require('express');
var router = express.Router();
var helper = new Helper();
var user = new (require('../../models/User'))();
var role_route = new (require('../../models/role_route'))();
var menu = new (require('../../models/menu'))();
router.post('/signin', function(req, res) {  
	if (!req.body.username || !req.body.password) {
		res.jsonp(helper.json_error('请输入账号密码!')); return;
	}
    user.login({username : req.body.username, password : req.body.password}, function(err, result) {
		if (err) { 
			res.jsonp(helper.json_error(result)); 
		}else{
			var _user =result[0];
			if (_user.id == 1) {
				menu.list('*', {field:['type'], value:[1]}, function (err,result) {
					if (err) {
						var user={id:_user.id, name:req.body.username}
						req.session.user=user;
						res.jsonp(helper.json_success('','success'));
						return ;
					}
					var user={id:_user.id, name:req.body.username};
					req.session.user=user;
					req.session.menu=helper.menu_tree(result,'pid');
					res.jsonp(helper.json_success('','success'));
				})
				return;
			}
			role_route.getAuth(_user.role_id,function (err, result) {
				if (err) { 
					var user={id:_user.id, name:req.body.username}
					req.session.user=user;
					res.jsonp(helper.json_success('','success'));
					return ;
				}
				menu.list('*', {field:['type'], value:[1]}, function (err,result) {
					if (err) {
						var user={id:_user.id, name:req.body.username}
						req.session.user=user;
						res.jsonp(helper.json_success('','success'));
						return ;
					}
					var user={id:_user.id, name:req.body.username, auth:result};
					req.session.user=user;
					req.session.menu=helper.menu_tree(result,'pid');
					res.jsonp(helper.json_success('','success'));
				})
			})
		}
	});
});
module.exports = router;