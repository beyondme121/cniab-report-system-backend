const Koa = require('koa')
const app = new Koa()
const body = require('koa-bodyparser')
// 公共中间件

app.use(body())

// 注册路由
const user = require('./router/user')
const category = require('./router/category')
const product = require('./router/product')


app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})


app.use(user.routes(), user.allowedMethods())
app.use(category.routes(), category.allowedMethods())
app.use(product.routes(), product.allowedMethods())


module.exports = app