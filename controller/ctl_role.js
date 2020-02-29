const genUUID = require('../utils/uuid')
const dayjs = require('dayjs')
// 引入model层  -- 负责数据库查询
const { find, create, findByName } = require('../models/role')

class Role {

  // 检查角色名称唯一性的中间件
  async checkRoleExist(ctx, next) {
    const result = await findByName(ctx.request.body.RoleName)
    console.log(result.recordset)
    if (result.recordset.length !== 0) {
      ctx.body = {
        status: 1,
        msg: '角色名称重复'
      }
    } else {
      await next()
    }
  }

  async create(ctx) {
    // 校验请求体参数
    ctx.verifyParams({
      RoleName: { type: 'string', required: true }
    })
    const { RoleName, RoleDesc, ParentRoleId } = ctx.request.body
    let RoleId = genUUID()
    let CreateUserId = 'xxx'
    let CreateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

    const result = await create({ RoleId, RoleName, RoleDesc, CreateUserId, CreateTime, ParentRoleId })
    if (result.rowsAffected > 0) {
      ctx.body = {
        status: 0,
        msg: '添加角色成功',
        data: { RoleId, RoleName, RoleDesc, CreateUserId, CreateTime, ParentRoleId }
      }
    } else {
      ctx.body = {
        status: 1,
        msg: '添加失败',
        data: ''
      }
    }
  }

  async find(ctx, next) {
    const result = await find()
    if (result.rowsAffected > 0) {
      ctx.body = {
        status: 0,
        msg: '查询用户成功',
        data: result.recordset
      }
    } else {
      ctx.body = {
        status: 1,
        msg: '查询用户失败',
        data: ''
      }
    }
  }

  async findByRoleName(ctx) {

  }

  delete() {

  }

  update() {

  }



}

module.exports = new Role()