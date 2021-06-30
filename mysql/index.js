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
    //改
    edit (data) {
        return new Promise((resolve, reject) => {
            let arr = [];
            for (let key in data) {
                if(key!=='id') {
                    arr.push(`${key}='${data[key]}'`);
                }
            }
            const search = arr.join(',');
            let sql = `UPDATE user SET ${search} WHERE id='${data.id}'`;
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
    //查
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
    //增
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
    //删
    remove (id) {
        return new Promise((resolve, reject) => {
            let sql = `DELETE FROM user where id='${id}'`;
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
        })
    }
}
 
module.exports = new Mysql()