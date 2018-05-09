module.exports = {
    port: 3000,
    session: {
        secret: '@!#$!#@$!@#$323',
        key: 'email-handle-system',
        maxAge: 2592000000
    },
    mysql: {
        host: '127.0.0.1',
        user: 'root',
        pwd: 'root',
        dbname: 'email_handle_system',
        port: 3306,
        db_prefix: 'tb_'
    },
    secret:'tibet20171220'

};