const { querySQL } = require('../utils/db')
const { query } = require('../utils/dbUtils')

// 1. 查询所有分类名称, 根据父级id查询所有子级分类
const dao_getProductList = () => {
  let sql = `SELECT _id,
                code,
                Profitcenter,
                name,
                Frame,
                PowerRate,
                voltage,
                product_group,
                price,
                status,
                createtime
             FROM [cniab-rms].[dbo].[Products]`
  return querySQL(sql)
}


const dao_getProductListByPage = (pageNum, pageSize) => {
  let sql = `
    SELECT
          temp_row.rownumber,
          temp_row._id,
          temp_row.code,
          temp_row.Profitcenter,
          temp_row.name,
          temp_row.Frame,
          temp_row.PowerRate,
          temp_row.voltage,
          temp_row.product_group,
          temp_row.price,
          temp_row.status,
          temp_row.createtime
      FROM
        (
          SELECT ROW_NUMBER() OVER (ORDER BY price desc) AS rownumber,
                _id,
                code,
                Profitcenter,
                name,
                Frame,
                PowerRate,
                voltage,
                product_group,
                price,
                status,
                createtime
          FROM [cniab-rms].[dbo].[Products]
        ) temp_row
      WHERE temp_row.rownumber > ((@pageNum - 1) * @pageSize)
      AND temp_row.rownumber <= (@pageNum * @pageSize);
  `
  return querySQL(sql, { pageNum, pageSize })
}

// 用于分页查询后端返回的总记录数
const dao_getProductTotalCount = () => {
  let sql = `
    select count(_id) as total 
    from [cniab-rms].[dbo].[Products]
  `
  return querySQL(sql)
}


// 根据关键词查询产品列表 数据
const dao_getSearchProductsByPage = (pageNum, pageSize, whereText) => {
  let sql = `
        SELECT
        temp_row.rownumber,
        temp_row._id,
        temp_row.code,
        temp_row.Profitcenter,
        temp_row.name,
        temp_row.Frame,
        temp_row.PowerRate,
        temp_row.voltage,
        temp_row.product_group,
        temp_row.price,
        temp_row.status,
        temp_row.createtime
      FROM
      (
        SELECT ROW_NUMBER() OVER (ORDER BY price desc) AS rownumber,
              _id,
              code,
              Profitcenter,
              name,
              Frame,
              PowerRate,
              voltage,
              product_group,
              price,
              status,
              createtime
        FROM [cniab-rms].[dbo].[Products]
        where ${whereText}
      ) temp_row
      WHERE temp_row.rownumber > ((${pageNum} - 1) * ${pageSize})
      AND temp_row.rownumber <= (${pageNum} * ${pageSize})
  `
  return query(sql)
}

// 根据关键词查询产品列表 的总记录数
const dao_getSearchProductTotalCount = (whereText) => {
  let sql = `
    select count(_id) as total 
    from [cniab-rms].[dbo].[Products]
    where ${whereText}
  `
  return query(sql)
}

// 根据产品 小pc查询 产品的层级
const dao_getProductHierachyByProfitCenter = (pc) => {
  let sql = `
    select * from dbo.ProductHierachy
    WHERE ProfitCenter=${pc}
  `
  return query(sql)
}

// 根据产品id更新产品状态
const dao_updateProductStatusById = (id, status) => {
  let sql = `
    UPDATE [cniab-rms].[dbo].[Products]
    SET status=${status}
    WHERE _id=${id}
  `
  return query(sql)
}


module.exports = {
  dao_getProductList,
  dao_getProductListByPage,
  dao_getProductTotalCount,

  dao_getSearchProductsByPage,
  dao_getSearchProductTotalCount,

  dao_getProductHierachyByProfitCenter,
  dao_updateProductStatusById
}