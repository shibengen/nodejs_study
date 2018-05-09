var express = require('express');
var router = express.Router();
var user = new (require('../../models/User'))();
var helper = new Helper();
var crypto = require('crypto');  //加载crypto库
//获取用户信息 by id
router.get('/user/:id', function(req, res) {
    console.log(req.params);
    if (!req.params.id) {
       res.jsonp(helper.json_error('params fail'));return;
    }
    user.find('id,username',{field:['id'],value:[ req.params.id]}, function(err, result) {
        if (err) { res.jsonp(helper.json_error('not found data'));return;};
        res.jsonp(helper.json_success(result, 'find'));
    });
});
//获取用户列表
router.get('/userlist', function(req, res) {
    user.list('', [], function(err, result) {
        if (err) { res.jsonp(helper.json_error('Not data'));return; };
        res.jsonp(helper.json_success(result, 'Userlist'));
    });
});

//修改密码
router.post('/update_password', function(req, res) {
    //修改超级管理员的密码,只能是超级管理员
    if (req.session.user.id != 1 && req.body.id==1) {
        res.jsonp(helper.json_error('Permission denied!'));return;
    }
    //TODO:后期加入访问权限控制
    if (!req.body.id || !req.body.password) {
       res.jsonp(helper.json_error('Params fail'));return;
    }
    var _password = crypto.createHash('sha1').update(req.body.password).digest('hex');
    user.update('password=?', [_password, req.body.id], function(err, result) {
        if (err) { res.jsonp(helper.json_error('Update password fail'));return; };
        res.jsonp(helper.json_success(result, 'Update password success'));
    });
});

//修改自己的密码 
router.post('/update_my_password', function(req, res) {
    console.log(req.body);
    if (!req.body.password || !req.body.old_password) {
        res.jsonp(helper.json_error('参数错误'));return;
    }
    uid = req.session.user.id;
    var _old_password = crypto.createHash('sha1').update(req.body.old_password).digest('hex');
    user.find( 
        'id'
        ,{ field:['id','password'],value:[uid, _old_password] }
        ,function (err,result) {
                if (err) {
                    res.jsonp(helper.json_error('旧密码错误!'));return;
                }
                var _password = crypto.createHash('sha1').update(req.body.password).digest('hex');
                user.update('password=?', 
                    [_password, uid], 
                    function(err, result) {
                    if (err) { res.jsonp(helper.json_error('密码更新失败')); return; };
                    res.jsonp(helper.json_success(result, 'Update password success'));
                });
        });
});

//delete
router.delete('/user/:id', function(req, res) {
    if (req.params.id==1) {
        return ;
    }
    user.delete(req.params.id,function (err,result) {
        if (err) { res.jsonp(helper.json_error('Delete fail'));return; };
        res.jsonp(helper.json_success(result, 'Delete success')); 
    });
});

//更新用户锁定状态
router.post('/user_lock', function(req, res) {
    if (!req.body.id || !req.body.login_lock) {
        res.jsonp(helper.json_error('params fail'));return;
    }
    if (req.body.id == 1) {
        res.jsonp(helper.json_error('Forbidden'));return;
    }
    user.update('login_lock=?', [req.body.login_lock, req.body.id], function(err, result) {
        if (err) { res.jsonp(helper.json_error('update fail'));return; };
        res.jsonp(helper.json_success(result, 'update success'));
    });
});
//保存用户角色
router.post('/update_user_role', function(req, res) {
    if  (!req.body.id || !req.body.role_id ) {
        res.jsonp(helper.json_error('params fail'));return;
    }
    if (req.body.id == 1) {
        res.jsonp(helper.json_error('没有权限改变超级管理员权限!'));return;
    }
    user.update('role_id = ?', [req.body.role_id, req.body.id], function(err, result) {
        if (err) { res.jsonp(helper.json_error('update fail'));return; };
        res.jsonp(helper.json_success(result, 'update success'));
    });
});
//注册用户
router.post('/register_user', function(req, res) {
    if (!req.body.username || !req.body.password ) {
        res.jsonp(helper.json_error('params fail'));return;
    }
    var auth = req.body.auth ? req.body.auth : 0;
    var login_lock = req.body.login_lock ? req.body.login_lock : 0;
    var data=[req.body.username, req.body.password, auth, login_lock];
   // console.log('===>',data);
    user.add(data, function(err, result) {
        console.log(err,result);
        if (err) { res.jsonp(helper.json_error(result));return; };
        res.jsonp(helper.json_success(result, 'success'));
    });
});
 
module.exports = router;