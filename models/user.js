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
            ,[first_login_time]
            ,[last_login_time]
            ,[login_count]
      FROM [cniab-rms].[dbo].[Users]
      WHERE [user_name]='${username}' AND [password]='${password}'
    `
    return query(sql)
  }

  // 创建用户基本信息
  insertUser(user) {
    const { user_id, user_name, password, email, ad_account, phone_no, create_time } = user
    let sql = `
      INSERT INTO [cniab-rms].[dbo].[Users]
      (
        [user_id]
        ,[user_name]
        ,[password]
        ,[email]
        ,[ad_account]
        ,[phone_no]
        ,[createtime]
      )
      VALUES(
        '${user_id}',
        '${user_name}',
        '${password}',
        '${email}',
        '${ad_account}',
        '${phone_no}',
        '${create_time}')
    `
    return query(sql)
  }

  // 创建用户角色关系桥接表
  insertUserRole(_id, user_id, role_id, create_time, create_user_id) {
    let sql = `
      INSERT INTO [cniab-rms].[dbo].[UsersRoles]
      (
        [_id]
        ,[user_id]
        ,[role_id]
        ,[create_time]
        ,[create_user_id]
      )
      VALUES('${_id}','${user_id}','${role_id}','${create_time}', '${create_user_id}')
    `
    return query(sql)
  }

  selectUserList() {
    let sql = `
      SELECT [user_id]
            ,[user_name]
            ,[password]
            ,[email]
            ,[ad_account]
            ,[phone_no]
            ,[createtime]
            ,[first_login_time]
            ,[last_login_time]
            ,[login_count]
      FROM [cniab-rms].[dbo].[Users]
    `
    return query(sql)
  }

  // 通过邮箱查询用户
  selectUserByEmail(email) {
    let sql = `
      SELECT *
      FROM [cniab-rms].[dbo].[Users]
      WHERE email='${email}'
    `
    return query(sql)
  }




}

module.exports = new User()