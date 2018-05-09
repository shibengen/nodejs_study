var db = require('../lib/db');
var Page = require('../lib/page');
var Document = function() {};
Document.prototype.find = function(id, _field, callback) {
    var sql = "SELECT " + _field + " FROM " + db.db_prefix + "document WHERE id =?";
    //console.log(sql);
    // get a connection from the pool
    db.pool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }
        // make the query
        connection.query(sql, [id], function(err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
        });
    });
};
Document.prototype.getList = function(where, where_val, p, _field, callback) {
    var _where = '';
    if (where) {
        _where = " WHERE " + where;
    };
    var _limit = 20;
    var sql0 = "SELECT count(*) as maxrow FROM " + db.db_prefix + "document " + _where + " limit 1";
    db.pool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }
        connection.query(sql0, [where_val], function(err, results) {
            if (err) {
                callback(true);
                return;
            }
            var maxrow = results[0].maxrow;
            //console.log('maxrow',maxrow);
            page = new Page();
            //分页
            page.setpage(maxrow, _limit, p, function(firstrow, lastrow, maxpage) {
                if (p > maxpage) { callback(true) };
                var sql1 = "SELECT " + _field + " FROM " + db.db_prefix + "document " + _where + " limit " + firstrow + ',' + lastrow;
                //console.log(sql1);
                db.pool.getConnection(function(err, connection) {
                    if (err) {
                        callback(true);
                        return;
                    }
                    // make the query
                    connection.query(sql1, [where_val], function(err, results) {
                        if (err) {
                            callback(true);
                            return;
                        }
                        callback(false, results);
                    });
                });
            });

        });
    });
};
module.exports = Document;