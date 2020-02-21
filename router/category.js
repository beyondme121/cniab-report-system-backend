// (产品)分类信息
const router = require('koa-router')()
router.prefix('/api/category')

const {
  ctl_getCategorys,
  ctl_updateCategory,
  ctl_newCategory
} = require('../controller/ctl_category')


router.get('/getList', async (ctx, next) => {
  // 获取GET的query参数
  const { parentId } = ctx.query
  const result = await ctl_getCategorys(parentId)
  ctx.body = result
})


router.post('/update', async (ctx, next) => {
  const { categoryId, categoryName } = ctx.request.body
  const result = await ctl_updateCategory(categoryId, categoryName)
  ctx.body = result
})

router.post('/add', async (ctx, next) => {
  const { parentId, categoryName } = ctx.request.body
  const result = await ctl_newCategory(parentId, categoryName)
  ctx.body = result
})


module.exports = router