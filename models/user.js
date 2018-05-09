var db = require('../lib/db');
var Page = require('../lib/page');
var crypto = require('crypto');  //加载crypto库
var util=require('util');
var User = function() {};
User.prototype.tableName = db.db_prefix + 'user';

User.prototype.find = function(_field, where, callback) {
    var _where='';
    where.field.forEach(function(value,index,array){
        if (!index) {
            console.log('field',value)
            _where+=  value + " = ? ";
        }else{
            _where+= " AND " + value + " = ? "; 
        }
    });
    var sql = "SELECT " + _field + " FROM " + this.tableName + " WHERE " + _where;
    console.log('find======>>>>>>>>',sql,'value===>',where.value);
    db.pool.getConnection(function(err, conn) {
        if (err) {
            callback(true);
            return;
        }
        conn.query(sql, where.value, function(err, results) {
            if (err) {
                console.log('find>>>>>>>>>>>>>>>>>>', err);
                conn.end();
                callback(true,1);
                return;
            }
            if (JSON.stringify(results) === '[]' || JSON.stringify(results) === '{}') {
                console.log('find', results)
                 conn.end();
                callback(true,2);
                return ;
            }
            conn.end();
            callback(false, results);
        });
    });
};
// 更新数据
User.prototype.update = function(_field, _values, callback) {
    var sql = "Update " + this.tableName + " SET " + _field + " WHERE id =?";
    console.log(sql);
    db.pool.getConnection(function(err, conn) {
        if (err) {
            callback(true);
            return;
        }
        conn.query(sql, _values, function(err, results) {
            if (err) {
                console.log('>>>>>>>>>>>>>>>>>>', err);
                conn.end();
                callback(true);
                return;
            }
            conn.end();
            callback(false, results);
        });
    });
};

User.prototype.list = function( _field,where, callback) {
    _field='u.*,r.name as role_name';
    var sql = "SELECT " + _field + " FROM " + this.tableName + " as u left join "+ db.db_prefix+"auth_role as r on u.role_id = r.id" ;
     console.log(sql);
    db.pool.getConnection(function(err, conn) {
        if (err) {
            callback(true);
            return;
        }
        conn.query(sql,where, function(err, results) {
            conn.end();
            if (err) {
                console.log('>>>>>>>>>>>>>>>>>> user list', err);
                callback(true);
                return;
            }
            if (JSON.stringify(results) === '[]' || JSON.stringify(results) === '{}') {
                console.log('xxx', results)
                callback(true);
            }
            var newDate = new Date();
            var date_str='';
            for(var i=0 ; i<results.length; i++){
                newDate.setTime( results[i]['last_login_time'] * 1000);
                date_str=newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate()+' '+newDate.getHours()+':'+newDate.getMinutes();
                results[i]['last_login_time']= date_str;
            }
            callback(false, results);
        });
    });
};

User.prototype.login = function(w, callback) {
    var sql = "SELECT  *  FROM " + this.tableName + " WHERE username=? and password=?";
    _password = crypto.createHash('sha1').update(w.password).digest('hex');
    db.pool.getConnection(function(err, conn) {
        if (err) {
            callback(true);
            return;
        }
        conn.query(sql, [w.username, _password], function(err, results) {
            if (err) {
                conn.end();
                callback(true,'未知错误,请联系管理员!');
                return;
            }
            if (JSON.stringify(results) === '[]' || JSON.stringify(results) === '{}') {
                conn.end();
                callback(true,'账号或密码错误');
                return;
            }else if(results[0].login_lock){
                callback(true,'该账号已锁定,不能登录');
                return;
            }
            //更新登录次数
            var sql2 = "UPDATE " + this.tableName + " SET login_count=login_count+1 ,last_login_time=? WHERE id=?"
            var today = parseInt(Date.now() / 1000);
            // console.log('today->'+today,sql2);
            conn.query(sql2, [today, results[0].id], function(err, results) {});
            conn.end();
            callback(false, results);
        });
    });
};
//register
User.prototype.add = function(values, callback) {
    this.find('id', {field:['username'],value:[values[0]]}, function (error,result) {
        if (error && result==1) {
            callback(true, 'Query Error!');
            return;
        }else if(!error){
            callback(true, '该账号已存在');
            return;
        }
        values[1]=  crypto.createHash('sha1').update(values[1]).digest('hex');
        var sql = "INSERT INTO  " + User.prototype.tableName + " (`username`,`password`,`auth`,`login_lock`) VALUES (?,?,?,?) ";
        //console.log(sql);
        db.pool.getConnection(function(err, conn) {
            if (err) {
                callback(true);
                return;
            }
            conn.query(sql, values, function(err, results) {
                if (err) {
                    console.log('>>>>>>>>>>>>>>>>>>', err);
                    conn.end();
                    callback(true);
                    return;
                }
                conn.end();
                callback(false, results);
            });
        });    
    });
 
};

//删除用户
User.prototype.delete = function(id, callback) {
    var sql = "DELETE FROM " + this.tableName + " WHERE id = ?";
    console.log('delete======>>>>>>>>',sql);
    db.pool.getConnection(function(err, conn) {
        if (err) {
            callback(true);
            return;
        }
        conn.query(sql, [id], function(err, results) {
            if (err) {
                console.log('delete>>>>>>>>>>>>>>>>>>', err);
                conn.end();
                callback(true,1);
                return;
            }
            if (JSON.stringify(results) === '[]' || JSON.stringify(results) === '{}') {
                console.log('delete', results)
                 conn.end();
                callback(true,2);
                return ;
            }
            conn.end();
            callback(false, results);
        });
    });
};
module.exports = User;