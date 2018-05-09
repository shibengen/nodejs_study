var express = require('express');
var path = require('path');
var config = require('config-lite')(__dirname);
var bodyParser = require("body-parser");
var Helper = require('./lib/helper');//助手
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var app = express();


app.use(cookieParser(config.secret));
app.use(session({
    secret: config.secret,//与cookieParser中的一致
    resave: true,
    saveUninitialized:true
}));
app.use(flash());//req.flash
app.locals.title = '邮件处理系统';
app.locals.strftime = require('strftime');
app.locals.email = 'sbgcode@gmail.com';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//使用模板引擎 
app.set('views', path.join(__dirname, 'views')); // 设置存放模板文件的目录
app.engine('html', require('ejs').renderFile); 
app.set('view engine', 'html');//设置模板后缀为.html
app.use(express.static(path.join(__dirname, 'static')));//静态资源位置 
//引入路由扩展
app.use(function(req, res, next){

	//TODO: 方便测试,直接写登录
// var user={
// 		id:1,  
// 		name:'admin'  
// 	}
// 	req.session.user=user;
	//TODO END
    res.locals.session = req.session;
    next();
});
var web = require('./routes/web/index');
var api = require('./routes/api/index');
//Router 开始路由
app.use('/web/', web);
app.use('/api/', api);
//处理未找到的页面!!
app.get('*', function(req, res) {
    res.sendStatus(403);
});
//test mysql
//listen
app.listen(config.port, function() {
	var _date=  new Date();
	var date_str=_date.getFullYear()+'-'+(_date.getMonth()+1)+'-'+_date.getDate()+' '+_date.getHours()+':'+_date.getMinutes()+':'+_date.getSeconds();
    console.log(app.locals.title + " 正在监听127.0.0.1:" + config.port + ' 开始于:'+ date_str);
});