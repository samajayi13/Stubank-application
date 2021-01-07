var mysql = require('mysql2');
var config = require('./dbConfig');
var sshClient = require('ssh2');

var connection = module.exports = function(){};

createDBConnection = function() {
    var mysqlConnection = mysql.createConnection({
        host: config.mySQLConfig.host,
        user: config.mySQLConfig.username,
        password: config.mySQLConfig.password,
        database: config.mySQLConfig.database
    });

    return mysqlConnection;
};

connection.invokeQuery = function(sqlQuery, data) {
    var ssh = new sshClient();

    ssh.connect(config.sshTunnelConfig);

    ssh.on('ready', function () {
        ssh.forwardOut('192.168.100.102',
            8000,
            config.localhost,
            config.mySQLConfig.port,
            function (err, stream) {

                config.mySQLConfig.stream = stream;
                var db = mysql.createConnection(config.mySQLConfig);

                db.query(sqlQuery, function(err, rows) {
                    if (rows) {
                        console.log(rows);

                        data(rows);
                    }
                });
            });
        });
};