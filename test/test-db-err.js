const sql = require('mssql');
const { MSSQL_CONFIG } = require('../config/db')
// console.log(MSSQL_CONFIG)
let config = {
  user: 'sa',
  password: '1qaz@WSX3edc$RFV',
  server: 'localhost',
  database: 'cniab-rms',
  pool: {
    max: 10,    // default 10
    min: 0,     // default 0
    idleTimeoutMillis: 30000    // default 30000
  }
}

const pool = new sql.ConnectionPool(MSSQL_CONFIG)
const poolConn = pool.connect()

pool.on('error', err => {
  console.log("error: ", error)
})

// 执行返回Promise
const query = async (queryText) => {
  await poolConn
  try {
    const request = pool.request()
    return await request.query(queryText)
  } catch (error) {
    console.log("error: ", error)
  }
}

module.exports = {
  query
}