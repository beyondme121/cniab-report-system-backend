const Koa = require('koa')
const app = new Koa()
const body = require('koa-bodyparser')
const koajwt = require('koa-jwt');
const parameter = require('koa-parameter');
const routing = require('./router')
const { secret } = require('./config/config')
// 公共中间件

app.use(body())

// 错误处理
app.use(async (ctx, next) => {
    return await next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = 'Protected resource, use Authorization header to get access\n';
        } else if (err.status = 500) {
            ctx.body = `服务端错误`
        } else {
            throw err;
        }
    })
})

app.use(koajwt({
    secret: secret
}).unless({
    path: [/\/api\/user\/login/]
}));

// 校验请求体参数的中间件
parameter(app);

// 使用自动化脚本加载路由
routing(app)

app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})



module.exports = app