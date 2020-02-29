const Router = require('koa-router')
const router = new Router({ prefix: '/api/role' })

// 引入控制器
const { find, create, checkRoleExist } = require('../controller/ctl_role')
// 路由

// 查询角色
router.get('/', find)
// 根据角色名称查询角色

// 增加角色
router.post('/', checkRoleExist, create)


module.exports = router