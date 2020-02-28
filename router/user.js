const router = require('koa-router')()
router.prefix('/api')
const jwt = require('jsonwebtoken');
const { dao_user_login_by_username_pwd } = require('../dao/dao_user')

router.post('/user/login', async ctx => {
    ctx.body = {
        status: 0,
        data: {
            token: 'xxxyyy',
            message: 'success'
        }
    }
})

// 用户登录 成功签发token
router.post('/login', async ctx => {
    const { username, password } = ctx.request.body
    if (!username || !password) {
        return ctx.body = {
            status: 1,
            data: null,
            msg: '参数不合法'
        }
    }

    // 查询用户的用户名密码是否正确
    let { rowsAffected, recordset } = await dao_user_login_by_username_pwd({ username, password })
    // 如果有返回结果
    if (rowsAffected > 0) {
        // 签发token
        const token = jwt.sign({
            user_id: recordset.user_id,
            user_name: recordset.username,
            login_time: recordset.login_time
        }, 'my_token', { expiresIn: '100day' })
        return ctx.body = {
            status: 0,
            data: token,
            msg: '登录成功'
        }
    } else {
        return ctx.body = {
            status: 2,
            data: null,
            msg: '用户名密码错误'
        }
    }
})

module.exports = router

