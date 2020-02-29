// 实现自动加载路由 fs
const fs = require('fs')

module.exports = app => {
  fs.readdirSync(__dirname).forEach(file => {   // 遍历每一个文件名
    if (file === 'index.js') return
    const route = require(`./${file}`)          // 获取文件导出的路由对象
    app.use(route.routes()).use(route.allowedMethods())
  })
}