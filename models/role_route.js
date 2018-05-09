var db = require('../lib/db');
var Page = require('../lib/page');
var RoleRoute = function() {};
RoleRoute.prototype.tableName = db.db_prefix + 'auth_role_route';
var _table_name=RoleRoute.prototype.tableName;
RoleRoute.prototype.find = function(_field, where, callback) {
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
RoleRoute.prototype.update = function(_field, _values, callback) {
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

RoleRoute.prototype.list = function( _field,where, callback) {
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

RoleRoute.prototype.listByRoleId = function( _field,  role_list, callback) {
    var sql = "SELECT role_id,name FROM "+ db.db_prefix +"auth_role_route rr LEFT JOIN "+ db.db_prefix +"auth_route r ON  rr.`route_id` = r.id ";
    // console.log(sql);
    db.pool.getConnection(function(err, conn) {
        if (err) {
            callback(true);
            return;
        }
        conn.query(sql,[], function(err, results) {
            conn.end();
            if (err || JSON.stringify(results) === '[]' || JSON.stringify(results) === '{}') {
                callback(false, role_list);
                return;
            }
            var str='';
            role_list.forEach(function (val, index) {
                str='';
                results.forEach(function (val2, index2) {
                    if (val2.role_id==val.id) {
                        str+=' '+val2.name;
                    }
                })
                role_list[index]['auth']=str;
            })
            callback(false, role_list);
        });
    });
};

//add
RoleRoute.prototype.add = function(data, callback) {
    this.delete(data[0], function (error,result) {
        if (error ) {
            callback(true, 'Query Error!');
            return;
        }
        var sql = "INSERT INTO  " + _table_name + " (`role_id`,`route_id`) VALUES  ";
        var sub_sql='';
        var value=[];
        console.log(data);
        data[1].forEach(function (val) {
            console.log(val);
            if (!sub_sql) {
                sub_sql="(?,?)";
            }else{
                sub_sql+=", (?,?)";
            }
            value.push(data[0]);
            value.push(val);
        })
        sql+=sub_sql;
        console.log(value,sql);
        db.pool.getConnection(function(err, conn) {
            if (err) {
                callback(true);
                return;
            }
            conn.query(sql, value, function(err, results) {
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
RoleRoute.prototype.delete = function(id, callback) {
    var sql = "DELETE FROM " + this.tableName + " WHERE role_id = ?";
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


//获取路由path
RoleRoute.prototype.getAuth = function(id, callback) {
    var sql = "SELECT url FROM " + db.db_prefix + "auth_route   WHERE id in (SELECT route_id FROM "+ this.tableName +" WHERE role_id = ?)";
    console.log('getAuth======>>>>>>>>',sql);
    db.pool.getConnection(function(err, conn) {
        if (err) {
            callback(true);
            return;
        }
        conn.query(sql, [id], function(err, results) {
            if (err) {
                console.log('getAuth>>>>>>>>>>>>>>>>>>', err);
                conn.end();
                callback(true,1);
                return;
            }
            if (JSON.stringify(results) === '[]' || JSON.stringify(results) === '{}') {
                console.log('getAuth', results)
                conn.end();
                callback(true,2);
                return ;
            }
            conn.end();
            callback(false, results);
        });
    });
};
module.exports = RoleRoute;