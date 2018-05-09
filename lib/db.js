var mysql = require('mysql');
var config = require('config-lite')(__dirname);
var pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.pwd,
    database: config.mysql.dbname,
    port: config.mysql.port
});
db = {
    pool: pool,
    db_prefix: config.mysql.db_prefix
}
module.exports = db;