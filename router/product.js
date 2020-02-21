const router = require('koa-router')()
router.prefix('/api/product')

const {
  ctl_getProductList,
  ctl_getProductListByPage,
  ctl_getSearchProductListByPage,
  ctl_getProductHierachyByPC,
  ctl_updateProductStatusById
} = require('../controller/ctl_product')

// 获取全部
router.get('/get-products', async (ctx, next) => {
  const result = await ctl_getProductList()
  ctx.body = result
})

// 分页
router.get('/listbypage', async ctx => {
  let { pageNum, pageSize } = ctx.query
  // 将url参数转换为后端需要的数值类型参数
  pageNum = parseInt(pageNum)
  pageSize = parseInt(pageSize)
  ctx.body = await ctl_getProductListByPage(pageNum, pageSize)
})

// 根据查询条件查询分页
router.get('/getListBySearch', async ctx => {
  let { pageNum, pageSize, ...obj } = ctx.query
  const result = await ctl_getSearchProductListByPage({ pageNum, pageSize, ...obj })
  ctx.body = result
})

router.get('/getProductHierachy', async ctx => {
  let { Profitcenter } = ctx.query
  console.log(Profitcenter)
  ctx.body = await ctl_getProductHierachyByPC(Profitcenter)
})

router.post('/update', async ctx => {
  let { id, status } = ctx.request.body
  const result = await ctl_updateProductStatusById(id, status)
  ctx.body = result
})

module.exports = router