const router = require('koa-router')()
router.prefix('/api')
const {
  login,
  getUserList,
  createUser
} = require('../controller/ctl_user')


router.post('/user/login', login)
router.get('/permission/user', getUserList)
router.post('/permission/user', createUser)

module.exports = router

