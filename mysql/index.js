var mysql = require('mysql');
var config = require('./config/default.js')

var options = {
    host     : config.database.HOST,
    user     : config.database.USERNAME,
    password : config.database.PASSWORD,
    database : config.database.DATABASE
}

var pool  = mysql.createPool(options);
 
class Mysql {
    constructor () {
 
    }

    query () {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * from user`;
            pool.query(sql, function (error, results) {
                if (error) {
                    throw error;
                }
                else {
                    resolve(results);
                }
            });
        });  
    }

    insert (data) {
        return new Promise((resolve, reject) => {
            let keyList = [];
            let valList = [];
            for (let key in data) {
                keyList.push(key);
                valList.push(`'${data[key]}'`);
            }
            console.log(valList);
            let sql = `INSERT INTO user (${keyList.toString()}) VALUES (${valList.toString()})`;

            pool.getConnection(function (err, connection) {
                if (err) {
                    throw err;
                }
                else {
                    connection.query(sql, function (error, results) {
                        if (error) {
                            throw error;
                        }
                        else {
                            resolve(results);
                        }
                    });
                }
            });
        });
    }
}
 
module.exports = new Mysql()