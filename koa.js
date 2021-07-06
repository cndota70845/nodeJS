const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const koaBody = require('koa-body');
const mysql = require('./mysql');
const fs = require('fs');
const path = require('path');
const cors = require('@koa/cors')();

app.use(cors);

app.use(koaBody({
    enableTypes: ['json', 'form', 'text'],
    multipart: true, // 是否支持 multipart-formdate 的表单
    formidable: {
        keepExtensions: true, // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小，缺省2M
        uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传目录
        onFileBegin: (name, file) => { // 文件上传前的设置
            const fp = path.join(__dirname, 'public/upload/');
            if (!fs.existsSync(fp)) { // 检查是否有“public/upload/”文件夹
              fs.mkdirSync(fp); // 没有就创建
            }
        }
    }
}));

app.use(async (ctx,next)=>{
    console.log(`Process ${ctx.request.method},${ctx.request.url}`);
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200; 
    } 
    else {
        await next();
    }
});

router.get('/login', async (ctx, next) => {
    var params = '/login.html';
    ctx.response.status = 200;
    ctx.response.type = 'text/html';
    fs.readFile(`./static${params}`,'utf-8',(err,data)=>{
        if (err) {
            console.log(err);
        }
        else {
            ctx.response.body = data.toString();
        }
    });
    ctx.response.body = `<div class="box">
        <h2>Login</h2>
        <form action="./signin" method="post">
            <div class="inputBox">
                <input type="text" name="name" required="">
                <label>Username</label>
            </div>
            <div class="inputBox">
                <input type="password" name="password" required="" autocomplete>
                <label>password</label>
            </div>
            <input type="submit" name="" value="登录" />
        </form>
        <a href="/user">去注册</a>
    </div>`
    await next();
});

router.get('/api/getUser/', async (ctx, next) => {

    function killNULL (origin) {
        let target = {};
        for (let key in origin) {
            if (['',undefined,null].includes(origin[key]) === false) {
                target[key] = origin[key];
            }
        }
        console.log(target);
        return target;
    }

    const params = {
        page:{
            size: ctx.request.query.page_size,
            current: ctx.request.query.page_current
        },
        search:ctx.request.query.search
            ? killNULL(ctx.request.query.search)
            : null
    }
    const res = await mysql.query(params);
    if (res) {
        console.log(res);
        ctx.body = {
            code:1,
            data:res.data,
            total:res.total
        };
    }
    await next();
});

router.get('/api/deleteUser/', async (ctx, next) => {
    var id = ctx.request.query.id;
    const res = await mysql.remove(id);
    if (res) {
        ctx.body = {
            code:1,
            msg:'数据删除成功'
        };
    }
    await next();
});

router.post('/api/editUser/', async (ctx, next) => {
    const params = ctx.request.body;
    const res = await mysql.edit(params);
    if (res) {
        ctx.body = {
            code:1,
            msg:'修改数据成功'
        };
    }
    await next();
});

router.post('/api/addUser/', async (ctx, next) => {
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
        res = await mysql.insert({name:name,password:password});
    if (res) {
        ctx.body = {
            code:1,
            msg:'添加数据成功'
        };
    }
    await next();
});

router.post('/api/fileUpload/', async (ctx, next) => {
    var id = ctx.request.body.id,
        file = ctx.request.files.file,
        filePath = path.extname(String(file.name));
    const res = await mysql.upload({id:id,file:{file_name:file.name,file_path:file.path,file_type:filePath}});
    if (res) {
        console.log(res);
        ctx.body = {
            code:1,
            msg:'上传文件成功'
        };
    }
    await next();
});

router.post('/signin', async (ctx, next) => {
    
});

// add router middleware:
app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');