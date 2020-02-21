const mssql = require('mssql')
const { MSSQL_CONFIG } = require('../config/db')

const conn = new mssql.ConnectionPool(MSSQL_CONFIG)
conn.on('error', err => {
  if (err) throw err;
})

conn.connect(err => {
  if (err) {
    console.error(err)
  }
})

let querySQL = async function (sql, params) {
  try {
    let ps = new mssql.PreparedStatement(conn)
    if (params != '') {
      for (let index in params) {
        if (typeof params[index] == 'number') {
          ps.input(index, mssql.Int)
        } else if (typeof params[index] == 'string') {
          ps.input(index, mssql.NVarChar)
        }
      }
    }
    // 测试sql打印
    // console.log("sql: ", sql)
    // 解析sql语句
    const prepared = await ps.prepare(sql)
    // 执行
    let recordset = await ps.execute(params)
    // 释放资源
    let releaseError = await ps.unprepare()
    return recordset
  } catch (error) {
    console.log('SELECT SQL Error ', error)
  }
}


/**
 * 插入数据: 限制: 插入的属性必须与DB table一致
 * @param {*} addObj 
 * @param {*} tableName 
 */
let insertSQL = async (addObj, tableName) => {
  try {
    let ps = new mssql.PreparedStatement(conn)
    let sql = `insert into ${tableName} (`
    if (addObj != '') {
      for (let index in addObj) {
        if (typeof addObj[index] == "number") {
          ps.input(index, mssql.Int);
        } else if (typeof addObj[index] == "string") {
          ps.input(index, mssql.NVarChar);
        }
        sql += index + ",";
      }
      sql = sql.substring(0, sql.length - 1) + ") values(";
      for (let index in addObj) {
        if (typeof addObj[index] == "number") {
          sql += addObj[index] + ",";
        } else if (typeof addObj[index] == "string") {
          sql += "'" + addObj[index] + "'" + ",";
        }
      }
    }
    sql = sql.substring(0, sql.length - 1) + ")";
    console.log("execute sql: ", sql)
    // 解析sql语句
    const prepared = await ps.prepare(sql)
    // 执行
    let recordset = await ps.execute(addObj)
    // 释放资源
    let releaseError = await ps.unprepare()
    return recordset
  } catch (error) {
    console.log('INSERT SQL Error ', error)
  }
}



module.exports = {
  querySQL,
  insertSQL
}
