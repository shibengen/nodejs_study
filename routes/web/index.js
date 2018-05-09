var express = require('express');
var router = express.Router();
const checkLogin = require('../../lib/check_login').checkLogin;
router.get('/', checkLogin, function(req, res) {
    var _page = '../index/index.html';
    res.render('layout/main', { page: _page, page_title: '管理首页' });
});
//================登录退出================
router.get('/login', function(req, res) {
    if (req.session.user) {
        res.redirect('/web');
    }
    var _page = '../signin/login.html';
    res.render('layout/main', { page: _page, page_title: 'Login' });
});

router.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('/web/login');
});

router.get('/error',function(req, res) {
    if (!req.session.user) {
        req.flash('login_msg', '未登录');
        return res.redirect('/web/login');
    }
    var _page = '../public/error.html';
    var error = req.flash('auth');
    var _layout = req.flash('layout');
    _layout = JSON.stringify(_layout) === '[]' ? 'main' : _layout;
    res.render('layout/'+ _layout, { page: _page, page_title: '错误信息' ,error});
});
//================END====================

//=============================用户================================
router.get('/user/userlist', checkLogin, function(req, res) {
    var _page = '../user/userlist.html';
    res.render('layout/main', { page: _page, page_title: '用户列表' });
});
//添加
router.get('/user/add_user', checkLogin, function(req, res) {
    var _page = '../user/add_user.html';
    res.render('layout/main', { page: _page, page_title: '添加用户' });
});
//=============================权限控制==============================
//路由管理
router.get('/auth/route', checkLogin, function(req, res) {
    var _page = '../auth/route.html';
    res.render('layout/main', { page: _page, page_title: '路由管理' });
});
//角色控制
router.get('/auth/role', checkLogin, function(req, res) {
    var _page = '../auth/role.html';
    res.render('layout/main', { page: _page, page_title: ' 角色管理' });
});
//菜单管理
router.get('/auth/menu', checkLogin, function(req, res) {
    var _page = '../auth/menu.html';
    res.render('layout/main', { page: _page, page_title: ' 菜单管理'});
});
//路由列表-用于角色权限选择
router.get('/auth/route_no_layout', checkLogin, function(req, res) { 
    var _page = '../auth/route_no_layout.html';
    res.render('layout/main_min', { page: _page, page_title: '路由列表' });
});
//角色列表-用户角色选择
router.get('/auth/role_no_layout', checkLogin, function(req, res) { 
    var _page = '../auth/role_no_layout.html';
    res.render('layout/main_min', { page: _page, page_title: '路由列表' });
});
//=============================END==================================
//=============================过虑词管理============================
//关键字管理
router.get('/keyword/keyword_list', checkLogin, function(req, res) { 
    var _page = '../keyword/keyword_list.html';
    res.render('layout/main', { page: _page, page_title: '关键字管理' });
});

//=============================END==================================
//
module.exports = router;