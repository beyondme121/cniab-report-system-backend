const router = require('koa-router')()
router.prefix('/api')
const {
  login,
  getUserList,
  createUser,
  removeUsers
} = require('../controller/ctl_user')

// 用户登录
router.post('/user/login', login)
// 获取用户列表
router.get('/permission/user', getUserList)
// 创建用户
router.post('/permission/user', createUser)
// 删除用户
router.delete('/permission/users', removeUsers)



module.exports = router

