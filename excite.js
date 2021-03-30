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
//引入MD5模块；
const md5 = require('md5');

const methods = require('./modules/methods.js');

const sd = require('silly-datetime');

methods.test();
// methods.FS();
// methods.readFile();
methods.getArr();

http.createServer((req,res) => {
    res.writeHead(200, {"Content-Type": "text/html;charset = 'utf-8'"});
    res.write(`<header><meta charset="UTF-8"></header>`);
    function init () {
        var btn = document.getElementById('btn');
        btn.addEventListener('click',methods.createFile('css'));
    }
    if (req.url !== '/favicon.ico') {
        const quary = url.parse(req.url,true).query;
        res.write(`<h2>姓名：${md5(quary.name)},年龄：${md5(quary.age)},<br>时间是:${sd.format(new Date(), 'YYYY-MM-DD HH:mm')},网站欢迎你</h2>`);
        res.write(`<button onclick="init()">点击新建一个css文件夹</button>`);
    }
    res.end();
}).listen(8081);

