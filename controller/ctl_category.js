const {
  dao_getCategorys,
  dao_updateCategory,
  dao_newCategory
} = require('../dao/dao_category')

const ctl_getCategorys = async (parentId) => {
  const result = await dao_getCategorys(parentId)
  if (result.rowsAffected > 0) {
    return {
      status: 0,
      data: result.recordset
    }
  } else {
    return {
      status: 1
    }
  }
}

const ctl_updateCategory = async (id, categoryName) => {
  const result = await dao_updateCategory(id, categoryName)
  if (result.rowsAffected > 0) {
    return {
      status: 0,
      message: '更新分类成功'
    }
  } else {
    return {
      status: 1,
      message: '更新分类失败'
    }
  }
}

const ctl_newCategory = async (parentId, categoryName) => {
  const result = await dao_newCategory(parentId, categoryName)
  if (result.rowsAffected > 0) {
    return {
      status: 0,
      message: '新增分类成功'
    }
  } else {
    return {
      status: 1,
      message: '新增分类失败'
    }
  }
}

module.exports = {
  ctl_getCategorys,
  ctl_updateCategory,
  ctl_newCategory
}