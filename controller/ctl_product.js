const {
  dao_getProductList,
  dao_getProductListByPage,
  dao_getProductTotalCount,
  dao_getSearchProductsByPage,
  dao_getSearchProductTotalCount,
  dao_getProductHierachyByProfitCenter,
  dao_updateProductStatusById
} = require('../dao/dao_product')

const ctl_getProductList = async () => {
  const result = await dao_getProductList()
  if (result.rowsAffected > 0) {
    return {
      status: 0,
      data: result.recordset
    }
  }
}


const ctl_getProductListByPage = async (pageNum, pageSize) => {

  const result = await dao_getProductListByPage(pageNum, pageSize)
  const count_result = await dao_getProductTotalCount()

  if (result.rowsAffected > 0 && count_result.rowsAffected > 0) {
    return {
      status: 0,
      data: {
        total: count_result.recordset[0].total,
        list: result.recordset
      }
    }
  }
}

const ctl_getSearchProductListByPage = async ({ pageNum, pageSize, ...rest }) => {
  let text = ''
  let arr = []
  Object.keys(rest).forEach(key => {
    arr.push(key + ` like '%${rest[key]}%'`)
  })
  text = arr.join(' and ')

  const results = await Promise.all([
    dao_getSearchProductsByPage(pageNum, pageSize, text),
    dao_getSearchProductTotalCount(text)
  ])


  if (results[0].rowsAffected > 0 && results[1].rowsAffected > 0) {
    return {
      status: 0,
      data: {
        list: results[0].recordset,
        total: results[1].recordset[0].total
      }
    }
  } else {
    return {
      status: 1,
      data: {
        list: [],
        total: 0
      }
    }
  }
}

const ctl_getProductHierachyByPC = async pc => {
  const result = await dao_getProductHierachyByProfitCenter(pc)
  if (result.rowsAffected > 0) {
    return {
      status: 0,
      data: result.recordset
    }
  }
}


const ctl_updateProductStatusById = async (id, status) => {
  const result = await dao_updateProductStatusById(id, status)
  if (result.rowsAffected > 0) {
    return {
      status: 0
    }
  }
}


module.exports = {
  ctl_getProductList,
  ctl_getProductListByPage,
  ctl_getSearchProductListByPage,
  ctl_getProductHierachyByPC,
  ctl_updateProductStatusById
}