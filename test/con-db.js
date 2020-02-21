const sql = require('mssql');

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
const pool = new sql.ConnectionPool(config)
const poolConn = pool.connect()

pool.on('error', err => {
  console.log("error: ", error)
})

let text = 'ACS510-01-195A-4'
let col = 'name'

const search = async () => {
  await poolConn
  try {
    const request = pool.request()
    const result = await request.query(`select * from [cniab-rms].[dbo].[Products] where name like '%${text}%'`)
    // const result = await request.query(`select * from [cniab-rms].[dbo].[Products] where ${col} like '%${text}%'`)
    console.log('============')
    console.log("result: ", result)
  } catch (err) {
    console.log("catch err: ", err)
  }
}

search()
