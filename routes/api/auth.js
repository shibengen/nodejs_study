var express = require('express');
var router = express.Router();
var route_model = new (require('../../models/Route'))();
var role_model = new (require('../../models/role'))();
var role_route_model = new (require('../../models/role_route'))();
var menu_model = new (require('../../models/menu'))();
var helper = new Helper();
//获取路由列表
router.get('/route_list', function(req, res) {
    route_model.list('*', [], function(err, result) {
        if (err) { res.jsonp(helper.json_error('Not data'));return; };
        res.jsonp(helper.json_success(result,'success'));
    });
});
//添加路由
router.post('/add_route', function(req, res) {
    if (!req.body.name || !req.body.url ) {
        res.jsonp(helper.json_error('params fail'));return;
    }
    var data=[req.body.name, req.body.url];
    console.log('===>',data);
    route_model.add(data, function(err, result) {
        if (err) { res.jsonp(helper.json_error(result));return; };
        res.jsonp(helper.json_success(result, 'success'));
    });
});
//删除路由
router.delete('/route/:id', function(req, res) {
     if (!req.params.id) { res.jsonp(helper.json_error('参数错误'));return; };
    route_model.delete(req.params.id,function (err,result) {
        if (err) { res.jsonp(helper.json_error('Delete fail'));return; };
        res.jsonp(helper.json_success(result, 'Delete success')); 
    });
});
//更新路由
router.post('/update_route/', function(req, res) {
    if (!req.body.id || (!req.body.name && !req.body.url)) {
          res.jsonp(helper.json_error('参数错误')); return;
    }
    if (req.body.name  && req.body.url) {
    	data=[req.body.name, req.body.url, req.body.id];
    	field=" name = ? , url = ?";
    }else if (req.body.name) {
    	data=[req.body.name, req.body.id];
    	field=" name = ?  ";
    }else if (req.body.url) {
    	data=[req.body.url, req.body.id];
    	field=" url = ?  ";
    }
    route_model.update(field,data,function (err,result) {
        if (err) { res.jsonp(helper.json_error('更新失败')); return; };
        res.jsonp(helper.json_success(result, 'success')); 
    });
});
//======================== 角色 ================================
//角色 
router.get('/role_list/', function(req, res) {
    role_model.list('*', [], function(err, result) {
        if (err) { res.jsonp(helper.json_error('Not data'));return; };
        role_route_model.listByRoleId('role_id, route_id',result,function (err,role_list) {
            res.jsonp(helper.json_success(role_list,'success'));
        });
        
    });
});
//添加角色
router.post('/add_role', function(req, res) {
    if (!req.body.name  ) {
        res.jsonp(helper.json_error('params fail'));return;
    }
    var data=[req.body.name];
    role_model.add(data, function(err, result) {
        if (err) { res.jsonp(helper.json_error(result));return; };
        res.jsonp(helper.json_success(result, 'success'));
    });
});
//更新角色
router.post('/update_role/', function(req, res) {
    if (!req.body.id || !req.body.name ) {
          res.jsonp(helper.json_error('参数错误')); return;
    }
	data=[req.body.name, req.body.id];
	field=" name = ?  ";
    role_model.update(field,data,function (err,result) {
        if (err) { res.jsonp(helper.json_error('更新失败')); return; };
        res.jsonp(helper.json_success(result, 'success')); 
    });
});

//删除角色
router.delete('/role/:id', function(req, res) {
    if (!req.params.id) { res.jsonp(helper.json_error('参数错误'));return; };
    role_model.delete(req.params.id,function (err,result) {
        if (err) { res.jsonp(helper.json_error('Delete fail'));return; };
        res.jsonp(helper.json_success(result, 'Delete success')); 
    });
});
//保存角色的路由访问权限 update_role_route
router.post('/update_role_route/', function(req, res) {
    var data= req.body;
    if (!data.id || !data.ids) { res.jsonp(helper.json_error('参数错误'));return; };
    role_route_model.add([data.id,data.ids],function (err,result) {
        if (err) { res.jsonp(helper.json_error('保存失败'));return; };
        res.jsonp(helper.json_success(result, 'success')); 
    });
});
//添加菜单
router.post('/add_menu', function(req, res) {
    if (!req.body.name  ) {
        res.jsonp(helper.json_error('params fail'));return;
    }
    var data=[req.body.name];
    var url = req.body.url ? req.body.url : '';
    var pid = req.body.pid ? req.body.pid : 0;
    data.push(url);
    data.push(req.body.pid);
     //console.log(data);return;
    menu_model.add(data, function(err, result) {
        if (err) { res.jsonp(helper.json_error(result));return; };
        res.jsonp(helper.json_success(result, 'success'));
    });
});
//菜单列表 
router.get('/menu_list/', function(req, res) {
    menu_model.list('*', null, function(err, result) {
        if (err) { res.jsonp(helper.json_error('Not data'));return; };
         res.jsonp(helper.json_success(result,'success'));
    });
});  
//菜单列表 
router.get('/menu/:pid', function(req, res) {
    // console.log(req.params)
    menu_model.list('*', {field:['pid'],value:[req.params.pid]}, function(err, result) {
        if (err) { res.jsonp(helper.json_error('Not data'));return; };
        res.jsonp(helper.json_success(result,'success'));
    });
});  
//删除菜单
router.delete('/menu/:id', function(req, res) {
     if (!req.params.id) { res.jsonp(helper.json_error('参数错误'));return; };
    menu_model.delete(req.params.id,function (err,result) {
        if (err) { res.jsonp(helper.json_error('Delete fail'));return; };
        res.jsonp(helper.json_success(result, 'Delete success')); 
    });
});
//更新菜单
router.post('/update_menu/', function(req, res) {
    if (!req.body.id || !req.body.name  ) {
        res.jsonp(helper.json_error('参数错误')); return;
    }
    var data=[req.body.name];
    var  field = " name = ?  ,url = ?  ,pid = ? ";
    var url = req.body.url ? req.body.url : '';
    var pid = req.body.pid ? req.body.pid : 0;
    data.push(url);
    data.push(req.body.pid);
    data.push(req.body.id);
    menu_model.update(field,data,function (err,result) {
        if (err) { res.jsonp(helper.json_error('更新失败')); return; };
        res.jsonp(helper.json_success(result, 'success')); 
    });
});

 
module.exports = router;