const http = require('http');
const fs = require('fs');
const common = require('./modules/common.js');
const path = require('path');

http.createServer((req,res) => {
    let params = req.url;
    console.log(params);
    if (params == '/') {
        params = '/login.html';
    }
    let extname = path.extname(params);
    let mime = common.getMime(extname);
    fs.readFile(`./static${params}`,(err,data)=>{
        if (err) {
            res.writeHead(404, {"Content-Type": `${mime};charset = 'utf-8'`});
            res.write(`<header><meta charset="UTF-8"></header>`);
            res.end('页面不存在');
            return;
        }
        res.writeHead(200, {"Content-Type": `${mime};charset = 'utf-8'`});
        res.end(data);
    });

}).listen(3000);