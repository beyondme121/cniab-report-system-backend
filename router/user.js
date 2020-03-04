const router = require('koa-router')()
router.prefix('/api/user')
const { login } = require('../controller/ctl_user')


router.post('/login', login)

module.exports = router

