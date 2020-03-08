const Router = require('koa-router')
const router = new Router({ prefix: '/api/permission/group' })

const {
  getUserGroupList,
  addUserGroup,
  updateUserGroup,
  checkGroupExist,          // 用户组存在
  deleteUserGroup,
  addUserIntoGroup,
  addRoleIntoGroup
} = require('../controller/ctl_group')

router.get('/', getUserGroupList)
router.post('/', addUserGroup)
router.put('/', checkGroupExist, updateUserGroup)
router.delete('/', deleteUserGroup)
router.post('/adduser', addUserIntoGroup)
router.post('/addrole', addRoleIntoGroup)

module.exports = router