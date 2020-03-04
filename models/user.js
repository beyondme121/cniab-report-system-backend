const { query } = require('../utils/dbUtils')

class User {

  findUserByUserNamePassword(username, password) {
    let sql = `
      SELECT [user_id]
          ,[user_name]
          ,[password]
          ,[email]
          ,[ad_account]
          ,[phone_no]
          ,[createtime]
          ,[login_time]
          ,[last_time]
          ,[login_count]
      FROM [cniab-rms].[dbo].[Users]
      WHERE [user_name]='${username}' AND [password]='${password}'
    `
    return query(sql)
  }


}

module.exports = new User()