const { query } = require('../utils/dbUtils')

const dao_user_login_by_username_pwd = ({ username, password }) => {
  let sql = `
    select * from dbo.[User]
    WHERE username='${username}' and password='${password}'
  `
  console.log("sql: ", sql)
  return query(sql)
}

module.exports = {
  dao_user_login_by_username_pwd
}