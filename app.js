const http = require('http');

const server = http.createServer();

server.on('request',function (request,response) {
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.write('hello');
    response.write(`<div><h1>你好</h1></div>`);
    // 告诉客户端，我的话说完了，你可以呈递给用户了
    response.end();
});

server.listen(3000, function () {
    console.log('服务器启动成功了，可以通过 http://127.0.0.1:3000/ 来进行访问')
});