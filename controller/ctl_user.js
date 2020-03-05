const jwt = require('jsonwebtoken');
const genUUID = require('../utils/uuid')
const dayjs = require('dayjs')
const { secret } = require('../config/config')
const {
  findUserByUserNamePassword
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

  // 用户注册
  async create(ctx) {

  }

}

module.exports = new UserCtl()