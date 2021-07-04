var mysql = require('mysql');
var config = require('./config/default.js')

var options = {
    host     : config.database.HOST,
    user     : config.database.USERNAME,
    password : config.database.PASSWORD,
    database : config.database.DATABASE
}

var pool = mysql.createPool(options);

async function getTotal () {
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
        console.log(res);
    }
}

 
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
            end = page_current*size,
            search = null;
        if (JSON.stringify(data.search)!=='{}') {
            let arr = [];
            for (let key in data.search) {
                arr.push(`${key}='${data[key]}'`);
            }
            search = arr.join(',');
        }
        return new Promise((resolve, reject) => {     
            const sql = `SELECT * FROM user
            ORDER BY id
            LIMIT ${begin},${end}`;
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
}
 
module.exports = new Mysql()