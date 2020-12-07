const express = require('express');
const mysql = require('mysql');
 
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '8889',
    database: 'node',
});
 
db.query("select * from notes", (err, data) => {
    if (err) {
        console.log("error!", err);
    } else {
        console.log("success!", data)
    }
});