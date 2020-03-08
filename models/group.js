const { query } = require('../utils/dbUtils')

class GroupModel {
  // 1. -------------------- 获取组信息 --------------------
  // 1.1 获取组列表 (只包含组的基本信息)
  selectGroupList() {
    let sql = `
      SELECT  a.[group_id],
              a.[parent_group_id],
              a.[group_name],
              a.[group_desc],
              a.[create_time],
              b.user_name create_user_name,
              c.user_name update_user_name,
              a.[update_time],
              a.[status]
      FROM [cniab-rms].[dbo].[Group] a INNER JOIN 
           [cniab-rms].[dbo].Users b ON a.create_user_id=b.user_id LEFT JOIN 
           [cniab-rms].[dbo].Users c ON a.update_user_id=c.user_id
      WHERE a.status = 1
    `
    return query(sql)
  }

  // 1.2 获取用户组中的所有用户列表
  selectUserListFromGroup(group_id) {
    let sql = ''
    if (!group_id) {
      sql = `
        SELECT user_id, group_id 
        FROM [cniab-rms].[dbo].GroupUsers
        WHERE [status]=1
      `
    } else {
      sql = `
        SELECT user_id, group_id 
        FROM [cniab-rms].[dbo].GroupUsers 
        WHERE group_id = '${group_id}' AND [status]=1
      `
    }
    return query(sql)
  }

  // 1.3 获取GroupRole中 组和角色的关系数据
  selectRoleListFromGroup(group_id) {
    let sql = ''
    if (!group_id) {
      sql = `
        select role_id, group_id 
        FROM [cniab-rms].[dbo].[GroupRole]
        WHERE [status]=1
      `
    } else {
      sql = `
        SELECT role_id, group_id 
        FROM [cniab-rms].[dbo].[GroupRole] 
        WHERE group_id = '${group_id}' AND [status]=1
      `
    }
    return query(sql)
  }


  // 2. -------------------- 创建组 --------------------
  insertGroup(group) {
    const {
      group_id, parent_group_id, group_name,
      group_desc, user_id, create_time } = group
    let sql = `
      INSERT INTO [cniab-rms].[dbo].[Group]
      (
         [group_id]
        ,[parent_group_id]
        ,[group_name]
        ,[group_desc]
        ,[create_user_id]
        ,[create_time]
        ,[update_user_id]
        ,[update_time]
        ,[status]
      )
      VALUES(
        '${group_id}',
        '${parent_group_id}',
        '${group_name}',
        '${group_desc}',
        '${user_id}',
        '${create_time}',
        '',
        '',
        '1'
      )
    `
    return query(sql)
  }

  // 3. -------------------- 更新组 --------------------
  updateGroupById(group) {
    const { group_id, parent_group_id, group_name, group_desc,
      update_user_id, update_time } = group
    let sql = `
      UPDATE [cniab-rms].[dbo].[Group]
      SET [parent_group_id] = '${parent_group_id}',
          group_name = '${group_name}',
          group_desc = '${group_desc}',
          update_user_id = '${update_user_id}',
          update_time='${update_time}'
      WHERE group_id='${group_id}' and status = 1
    `
    return query(sql)
  }

  // 3.1 根据组的名称查询组
  selectGroupByName(group_name) {
    let sql = `
      SELECT * FROM [cniab-rms].[dbo].[Group]
      WHERE group_name='${group_name}' and status=1
    `
    return query(sql)
  }

  // 3.2
  selectGroupById(group_id) {
    let sql = `
      SELECT * FROM [cniab-rms].[dbo].[Group]
      WHERE group_id='${group_id}' and status = 1
    `
    return query(sql)
  }


  // 4. ---------------------------------- 软删除组 ----------------------------------
  // 1. 更新Group的状态
  deleteGroup(group_id) {
    let sql = `
      UPDATE [cniab-rms].[dbo].[Group]
      SET status = -1
      where group_id='${group_id}' and status = 1
    `
    return query(sql)
  }
  // 2. 软删除GroupUser
  deleteGroupUsers(group_id) {
    let sql = `
      UPDATE [cniab-rms].[dbo].[GroupUsers]
      SET status = -1
      WHERE group_id='${group_id}' and status = 1
    `
    return query(sql)
  }

  // 3. 软删除GroupRole
  deleteGroupRoles(group_id) {
    let sql = `
      UPDATE [cniab-rms].[dbo].[GroupRole]
      SET status = -1
      WHERE group_id='${group_id}' and status = 1
    `
    return query(sql)
  }

  // 5. ---------------------------------- 给用户组添加用户 ----------------------------------
  insertUsersIntoGroup(data) {
    let { user_group_id, user_id, group_id, create_time, create_user_id } = data
    let sql = `
      INSERT INTO [dbo].[GroupUsers]
      (
        [user_group_id]
        ,[user_id]
        ,[group_id]
        ,[create_time]
        ,[create_user_id]
        ,[status]
      )
      VALUES('${user_group_id}','${user_id}','${group_id}','${create_time}','${create_user_id}', '1')
    `
    return query(sql)
  }

  // 6. ---------------------------------- 给用户组添加角色 ----------------------------------
  insertRoleIntoGroup(data) {
    let { group_role_id, role_id, group_id, create_time, create_user_id } = data
    let sql = `
      INSERT INTO [cniab-rms].[dbo].[GroupRole]
      (
        [group_role_id]
        ,[group_id]
        ,[role_id]
        ,[create_time]
        ,[create_user_id]
        ,[status]
      )
      VALUES('${group_role_id}','${group_id}','${role_id}','${create_time}','${create_user_id}', '1')
    `
    return query(sql)
  }

}

module.exports = new GroupModel()