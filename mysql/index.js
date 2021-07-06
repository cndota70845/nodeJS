var mysql = require('mysql');
var config = require('./config/default.js')

var options = {
    host     : config.database.HOST,
    user     : config.database.USERNAME,
    password : config.database.PASSWORD,
    database : config.database.DATABASE
}

var pool = mysql.createPool(options);
 
class Mysql {
    constructor () {
        this.total = 0;
    }

    async getTotal () {
        var sql_total = `SELECT COUNT(*) FROM user`;
        const res = await new Promise((resolve, reject) => {
            pool.query(sql_total,function (error, results) {
                if (error) {
                    throw error;
                }
                else {
                    resolve(results);
                }
            });
        });
        if (res) {
            this.total = Object.values(res[0])[0];
        }
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
    query (data) {
        var page_current = data.page.current,
            size = data.page.size,
            begin = (page_current - 1)*size,
            search = null;
        if (JSON.stringify(data.search)!=='{}') {
            let arr = [];
            for (let key in data.search) {
                arr.push(`${key}='${data[key]}'`);
            }
            search = arr.join(',');
        }
        return new Promise((resolve, reject) => {     
            const sql = `SELECT * 
            FROM 
                user
            LEFT JOIN file ON user.file = file.file_id
            LIMIT ${size} OFFSET ${begin}`;
            this.getTotal();
            const total = this.total;
            pool.query(sql, function (error, results) {
                if (error) {
                    throw error;
                }
                else {
                    resolve({
                        total:total,
                        data: results
                    });
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
        });
    }
    //上传
    upload (obj) {
        return new Promise((resolve, reject) => {
            console.log(obj);
            let keyList = [];
            let valList = [];
            for (let key in obj.file) {
                keyList.push(key);
                valList.push(`'${obj.file[key]}'`);
            }
            console.log(valList);
            let sql = `INSERT INTO file (${keyList.toString()}) VALUES (${valList.toString()})`;

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
                            console.log('results',results.insertId);
                            const insertId = results.insertId;
                            let sql_2 = `UPDATE user SET file=${insertId} WHERE id='${obj.id}'`;
                            connection.query(sql_2, function (error_2, results_2) {
                                if (error_2) {
                                    throw error_2;
                                }
                                else {
                                    resolve(results);
                                }
                            });
                        }
                    });
                }
            });
        });
    }
}
 
module.exports = new Mysql()