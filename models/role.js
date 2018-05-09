var db = require('../lib/db');
var Page = require('../lib/page');
var Role = function() {};
Role.prototype.tableName = db.db_prefix + 'auth_role';
var _table_name=Role.prototype.tableName;
Role.prototype.find = function(_field, where, callback) {
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
Role.prototype.update = function(_field, _values, callback) {
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

Role.prototype.list = function( _field,where, callback) {
    var sql = "SELECT " + _field + " FROM " + this.tableName ;
    // console.log(sql);
    db.pool.getConnection(function(err, conn) {
        if (err) {
            callback(true);
            return;
        }
        conn.query(sql,where, function(err, results) {
            conn.end();
            if (err) {
                console.log('>>>>>>>>>>>>>>>>>>  list', err);
                callback(true);
                return;
            }
            if (JSON.stringify(results) === '[]' || JSON.stringify(results) === '{}') {
                console.log('----->', results);
                callback(true);
                return;
            }
            callback(false, results);
        });
    });
};


//add
Role.prototype.add = function(values, callback) {
    this.find('id', {field:['name'],value:[values[0]]}, function (error,result) {
        if (error && result==1) {
            callback(true, 'Query Error!');
            return;
        }else if(!error){
            callback(true, '该角色已存在');
            return;
        }
        var sql = "INSERT INTO  " + _table_name + " (`name`) VALUES (?) ";
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
                    callback(true,'添加失败');
                    return;
                }
                conn.end();
                callback(false, results);
            });
        });    
    });
 
};

//删除
Role.prototype.delete = function(id, callback) {
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
            conn.end()
            callback(false, results);
        });
    });
};
module.exports = Role;