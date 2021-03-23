// //引入http模块；
// var http = require('http');

// // request 获取url传过来的信息；
// // response 给浏览器的响应信息；

// http.createServer(function (request, response) {
//     //设置响应头；
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     //输出页面+结束响应；
//     response.end('Hello World');
// }).listen(8081);

// console.log('Server running at http://127.0.0.1:8081/');

// 代码块 node-http-server;

const http = require('http');
//解析GET请求参数；
const url = require('url');
//
const methods = require('./modules/methods.js');

methods.test();

http.createServer((req,res) => {
    res.writeHead(200, {"Content-Type": "text/html;charset = 'utf-8'"});
    res.write(`<header><meta charset="UTF-8"></header>`);

    if (req.url !== '/favicon.ico') {
        const quary = url.parse(req.url,true).query;
        res.write(`<h2>姓名：${quary.name},年龄：${quary.age},网站欢迎你</h2>`);
    }

    res.end();
}).listen(8081);