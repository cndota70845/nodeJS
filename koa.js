const Koa = require('koa'),
    app = new Koa(),
    router = require('koa-router')(),
    bodyParser = require('koa-bodyparser'),
    mysql = require('./mysql'),
    path = require('path'),
    fs = require('fs')

var user = undefined;

app.use(async (ctx,next)=>{
    console.log(`Process ${ctx.request.method},${ctx.request.url}`);
    user = await mysql.query();
    await next();
});

router.get('/', async (ctx, next) => {
    var params = '/login.html'

    var data = fs.readFile(`./static${params}`,(err,data)=>{
        if (err) {
            console.log(err);
            return;
        }
        return data;
    });
    console.log(data);
    ctx.response.status = 200;
        ctx.response.type = 'text/html';
        ctx.response.body = data;
    await next();
});

router.get('/user', async (ctx, next) => {
    ctx.response.body = `<h1>User</h1>
        <form action="/user" method="post">
            <p>Name: <input name="name" value=""></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="添加"></p>
        </form>`;
});

router.post('/user', async (ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
        res = await mysql.insert({name:name,password:password});
    ctx.response.body = `<h1>添加用户，姓名: ${name}, 密码: ${password}</h1>`;
});

router.post('/signin', async (ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
        comfirm = false;
    user.forEach(item => {
        console.log(item.name,item.password,name,password)
        if (item.name === name && String(item.password) === password) {
            comfirm = true;
        }   
    });
    if (comfirm) {
        return ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    }
    else {
        return ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
});

app.use(bodyParser());
// add router middleware:
app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');