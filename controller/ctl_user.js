const jwt = require('jsonwebtoken');
const genUUID = require('../utils/uuid')
const dayjs = require('dayjs')
const { secret } = require('../config/config')
const {
  findUserByUserNamePassword,
  insertUser,
  selectUserList,
  selectUserByEmail,
  insertUserRole
} = require('../models/user')

class UserCtl {

  async login(ctx) {
    // 校验请求体参数
    ctx.verifyParams({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const { username, password } = ctx.request.body
    const { rowsAffected, recordset } = await findUserByUserNamePassword(username, password)
    if (rowsAffected > 0) {
      // 签发token
      const token = jwt.sign({
        user_id: recordset[0].user_id,
        user_name: recordset[0].user_name
      }, secret, { expiresIn: '1d' })
      const { user_id, user_name, email, ad_account, phone_no } = recordset[0]
      const user = { user_id, user_name, email, ad_account, phone_no }
      return ctx.body = {
        status: 0,
        data: {
          token,
          user
        },
        msg: '登录成功'
      }
    } else {
      ctx.body = {
        status: 1,
        msg: '用户名或密码不正确'
      }
    }
  }

  // 用户注册 (基本信息 + 用户所属角色)
  async createUser(ctx) {
    let { user_name, password, email, ad_account, phone_no, roles } = ctx.request.body
    let user_id = genUUID()
    let create_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    email = email.toUpperCase()
    ad_account = ad_account.toUpperCase()
    // 根据用户邮箱查询是否存在该用户
    const { rowsAffected } = await selectUserByEmail(email)
    if (rowsAffected > 0) {
      ctx.body = {
        status: 1,
        msg: '用户邮箱已经被占用'
      }
      return
    }
    try {
      const res1 = await insertUser({ user_id, user_name, password, email, ad_account, phone_no, create_time })
      const res2 = await UserCtl.createUserRole(user_id, roles, ctx.state.user.user_id)
      if (res1.rowsAffected > 0 || res2.count > 0) {
        ctx.body = {
          status: 0,
          data: {
            user_id, user_name, password, email,
            ad_account, phone_no, create_time,
            roles
          },
          msg: `创建用户${user_name}成功`
        }
      } else {
        ctx.body = {
          status: 1,
          msg: `创建用户${user_name}失败`
        }
      }
    } catch (error) {
      console.log("error: ", error)
    }
  }

  /**
   * 
   * @param {被创建用户的id} user_id 
   * @param {被创建用户所属角色id数组} roles 
   * @param {创建用户的用户id(通常是管理员角色)} create_user_id 
   * @param {更新用户的用户id(通常是管理员角色)} update_user_id 
   */
  static async createUserRole(user_id, roles, create_user_id) {
    let _id = genUUID()
    let create_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    let count = 0
    roles.forEach(async role_id => {
      let { rowsAffected } = await insertUserRole(_id, user_id, role_id, create_time, create_user_id, null, null)
      if (rowsAffected > 0) {
        count++
      }
    })
    return {
      count
    }
  }

  // 获取用户列表
  async getUserList(ctx) {
    const result = await selectUserList()
    if (result.rowsAffected > 0) {
      ctx.body = {
        status: 0,
        data: result.recordset,
        msg: '查询用户成功'
      }
    } else {
      ctx.body = {
        status: 1,
        msg: '查询用户失败'
      }
    }
  }

}

module.exports = new UserCtl()