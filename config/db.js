const env = process.env.NODE_ENV

let MSSQL_CONFIG = {}
let REDIS_CONFIG = {}
let SESSION_CONFIG = {}
let secretOrKey = ''

// 测试开发环境, 只要不是生产环境
if (env !== 'prd') {
  MSSQL_CONFIG = {
    user: 'sa',
    password: '1qaz@WSX3edc$RFV',
    server: 'localhost',
    database: 'cniab-rms',
    pool: {
      max: 10,    // default 10
      min: 0,     // default 0
      idleTimeoutMillis: 30000    // default 30000
    },
    options: {
      encrypt: true,
      enableArithAbort: true
    },
  }
  REDIS_CONFIG = {
    host: '127.0.0.1',
    port: 6379
  }

  SESSION_CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  }

  secretOrKey = "sanfeng8848" //
} else {
  // 上线之后配置生产环境
  MSSQL_CONFIG = {
    user: 'sa',
    password: '1qaz@WSX3edc$RFV',
    server: 'localhost',
    database: 'report',
    pool: {
      max: 10,    // default 10
      min: 0,     // default 0
      idleTimeoutMillis: 30000    // default 30000
    }
  }
  REDIS_CONFIG = {
    host: '127.0.0.1',
    port: 6379
  }

  SESSION_CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
  }

  secretOrKey = "sanfeng8848" //
}


module.exports = {
  MSSQL_CONFIG,
  REDIS_CONFIG,
  SESSION_CONFIG,
  secretOrKey
}