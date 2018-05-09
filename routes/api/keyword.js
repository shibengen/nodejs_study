var express = require('express');
var router = express.Router();
var keyword_model = new (require('../../models/Keyword'))();

var helper = new Helper();
//获取关键词列表 var today = parseInt(Date.now() / 1000);
router.get('/keyword_list', function(req, res) {
    keyword_model.list('*', [], function(err, result) {
        if (err) { res.jsonp(helper.json_error('Not data'));return; };
        res.jsonp(helper.json_success(result,'success'));
    });
});
//添加
router.post('/add_keyword', function(req, res) {
    console.log(req.body);
    if (!req.body.keyword ) {
        res.jsonp(helper.json_error('params fail'));return;
    }
    var curr_time = parseInt(Date.now() / 1000);
    var uid = req.session.user.id;
    var data=[uid,req.body.name, curr_time];
    console.log('===>',data);
    return;
    route_model.add(data, function(err, result) {
        if (err) { res.jsonp(helper.json_error(result));return; };
        res.jsonp(helper.json_success(result, 'success'));
    });
});
module.exports = router;