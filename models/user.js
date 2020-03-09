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
        ,[status]
      )
      VALUES(
        '${user_id}',
        '${user_name}',
        '${password}',
        '${email}',
        '${ad_account}',
        '${phone_no}',
        '${create_time}',
        1
      )
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
        ,[status]
      )
      VALUES('${_id}','${user_id}','${role_id}','${create_time}', '${create_user_id}', 1)
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
            ,[status]
      FROM [cniab-rms].[dbo].[Users]
      where [status] = 1 AND user_name!='admin'
    `
    return query(sql)
  }

  // 通过邮箱查询用户
  selectUserByEmail(email) {
    let sql = `
      SELECT *
      FROM [cniab-rms].[dbo].[Users]
      WHERE email='${email}' and status = 1
    `
    return query(sql)
  }

  // ------------------- 软删除用户 -------------------
  // 1. 更新用户表中用户的状态为-1
  deleteUsersByUserIdsFromUsers(user_id) {
    let sql = `
      UPDATE [cniab-rms].[dbo].[Users]
      SET status=-1
      WHERE user_id='${user_id}' and status=1 
    `
    return query(sql)
  }
  // 2. 更新用户组与用户桥接表中用户的状态为-1
  deleteUsersByUserIdFromGroupUser(user_id) {
    let sql = `
      UPDATE [cniab-rms].[dbo].[GroupUsers]
      SET status = -1
      WHERE user_id='${user_id}' and status = 1
    `
    return query(sql)
  }

  // 3. 更新用户角色表中用户的状态为-1
  deleteUsersByUserIdFromUserRole(user_id) {
    let sql = `
      UPDATE [cniab-rms].[dbo].[UsersRoles]
      SET status = -1
      WHERE user_id='${user_id}' and status = 1
    `
    return query(sql)
  }


}

module.exports = new User()