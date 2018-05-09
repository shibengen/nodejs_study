module.exports = {
	checkLogin: function checkLogin (req, res, next) {
		if (!req.session.user) {
			  req.flash('login_msg', '未登录!');
			  return res.redirect('/web/login');
		}
		// console.log('=====================>',req);
		if (req.session.user.id != 1 ) {
			var _menu=req.session.menu;
			var _path =req.route.path;
			var _isok = false;
			// console.log('------->', _path)
			if (_path != '/') {

				if (!_menu) {
					req.flash('auth', '没有权限访问');
					return res.redirect('/web/error');// 返回之前的页面
				}else{
					_menu.forEach(function (val) {
						val['sub'].forEach(function (sub) {
							if (sub.url==_path) {
								_isok=true;
							}
						})
					})
				}
				console.log(_isok)
				if (!_isok) {
					req.flash('auth', '没有权限访问');
					return res.redirect('/web/error');// 返回之前的页面
				}
			}
		}
		next();
	},
	checkNotLogin: function checkNotLogin (req, res, next) {
		if (req.session.user) {
			req.flash('login_msg', '已登录');
			return res.redirect('back');// 返回之前的页面
		}
		next();
	}
}