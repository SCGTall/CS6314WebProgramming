const mysql = require('mysql');
let g = require('../modules/globals');

// db option
const dbOption = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '8889',
    database: 'final_project',
    timezone: "-06:00",
}
exports.dbOption = dbOption;
const connection = mysql.createConnection(dbOption);

connection.connect((err) => {
    if (err) {
        if (g.logLevel <= g.Level.DEBUGGING) {
            console.log("Connection fail!");
        }
    }
    else {
        if (g.logLevel <= g.Level.DEBUGGING) {
            console.log("Connection success!");
        }
    }
});
 
let query = (sql, callback) => {
    connection.query(sql, function (err, rows) {
        callback(err, rows);
    });
};

exports.query = query

