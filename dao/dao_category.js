const { querySQL } = require('../utils/db')

// 1. 查询所有分类名称, 根据父级id查询所有子级分类
const dao_getCategorys = (parentId) => {
  let sql = `SELECT [_id]
              ,[categoryName]
              ,[parentId]
             FROM [cniab-rms].[dbo].[Categorys]
             where parentId=@parentId`
  return querySQL(sql, { parentId })
}

// 2. 根据分类id更新分类名称
const dao_updateCategory = (id, categoryName) => {
  let sql = `
    UPDATE [cniab-rms].[dbo].[Categorys]
    SET [categoryName]=@categoryName
    WHERE _id=@id
  `
  return querySQL(sql, { id, categoryName })
}

// 3. 新增分类
const dao_newCategory = async (parentId, categoryName) => {
  let sql = `
    INSERT INTO [cniab-rms].[dbo].[Categorys]
    VALUES(@categoryName, @parentId)
  `
  return querySQL(sql, { parentId, categoryName })
}


module.exports = {
  dao_getCategorys,
  dao_updateCategory,
  dao_newCategory
}