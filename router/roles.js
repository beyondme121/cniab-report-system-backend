const Router = require('koa-router')
const router = new Router({ prefix: '/api/role' })

// 引入控制器
const { getRoleListWithMenus, create, checkRoleExist, updateRoleInfo } = require('../controller/ctl_role')
// 路由

// 查询角色
router.get('/', getRoleListWithMenus)
// 根据角色名称查询角色

// 增加角色
router.post('/', checkRoleExist, create)

// 更新角色的基本信息以及权限
router.post('/update', updateRoleInfo)
// 

module.exports = router