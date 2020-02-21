const router = require('koa-router')()
router.prefix('/api')

router.post('/user/login', async ctx => {
    ctx.body = {
        status: 0,
        data: {
            token: 'xxxyyy',
            message: 'success'
        }
    }
})

module.exports = router

