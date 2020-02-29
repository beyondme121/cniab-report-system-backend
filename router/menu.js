const Router = require('koa-router')
const router = new Router({ prefix: '/api/permission/menu' })
const { findMenus, create, findMenuIcons } = require('../controller/ctl_menu')

router.get('/', findMenus)
router.post('/', create)

// 获取菜单的图标
router.get('/icons', findMenuIcons)

module.exports = router