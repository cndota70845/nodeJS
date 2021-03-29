const fs = require('fs');

function test () {
    console.log('项目启动成功');
}

function FS () {
    fs.stat('./package.json',(err,data) => {
        if (err) {
            console.log(err);
            return;
        }
        else {
            console.log(`package.json是文件吗？回答是：${data.isFile()}`);
            return;
        }
    });
}

function createFile (filename) {
    fs.mkdir(`./${filename}`,(err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('创建成功');
    })
}

// function write (filename,content) {
//     fs.writeFile(`./${filename}`,content,(err) => {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         console.log('写入成功');
//     })
// }

function readFile () {
    fs.readFile('./index.html',(err,data)=>{
        if (err) {
            console.log(err);
            return;
        }
        console.log(data,data.toString());
    })
}
//fs方法都是异步方法；
function getArr () {
    fs.readdir('./file',(err,data)=>{
        if (err) {
            console.log(err);
            return;
        }
        var arr = [];
        console.log(data);
    })
}


exports.test = test;
exports.FS = FS;
exports.createFile = createFile;
exports.readFile = readFile;
exports.getArr = getArr;