const mysql = require('mysql');
 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '8889',
    database: 'node'
});

connection.connect((err) => {
    if (err) { console.log("error!") }
    else { console.log("success!") }
});
 
let query = (sql, callback) => {
    connection.query(sql, function (err, rows) {
        callback(err, rows);
    });
};

exports.query = query