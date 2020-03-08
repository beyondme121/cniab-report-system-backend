const { query } = require('../utils/dbUtils')

class GroupModel {
  // 1. 获取组列表 (只包含组的基本信息[组的角色以及包含用户通过其他接口处理])
  getGroupList() {
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
           [cniab-rms].[dbo].Users b ON a.create_user_id=b.user_id INNER JOIN 
           [cniab-rms].[dbo].Users c ON a.update_user_id=c.user_id
      WHERE a.status = 1
    `
    return query(sql)
  }

  // 2. 获取用户组中的所有用户列表
  getUserListFromGroup(group_id) {
    let sql = ''
    if (!group_id) {
      sql = `
        select user_id, group_id from [cniab-rms].[dbo].GroupUsers
      `
    } else {
      sql = `
        select user_id, group_id from [cniab-rms].[dbo].GroupUsers where group_id = '${group_id}'
      `
    }
    return query(sql)
  }

  // 2. 根据组的名称查询组
  getGroupByName(group_name) {
    let sql = `
      SELECT * FROM [cniab-rms].[dbo].[Group]
      WHERE group_name='${group_name}'
    `
    return query(sql)
  }
  // 3. 
  getGroupById(group_id) {
    let sql = `
      SELECT * FROM [cniab-rms].[dbo].[Group]
      WHERE group_id='${group_id}'
    `
    return query(sql)
  }

  // 4. 创建组
  createGroup(group) {
    const { group_id, parent_group_id, group_name, group_desc, user_id, create_time } = group
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
        'NULL',
        1
      )
    `
    return query(sql)
  }

  // 5. 更新组
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
      WHERE group_id='${group_id}'
    `
    return query(sql)
  }

  // 软删除组
  deleteGroup(group_id) {
    let sql = `
      UPDATE [cniab-rms].[dbo].[Group]
      SET status = -1
      where group_id='${group_id}'
    `
    return query(sql)
  }

  // 给用户组添加用户
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
      )
      VALUES('${user_group_id}','${user_id}','${group_id}','${create_time}','${create_user_id}')
    `
    return query(sql)
  }

  // 删除用户组中的某个组的所有记录, 是组 添加用户的前置操作
  deleteUsersFromGroup(group_id) {
    let sql = `
      delete from  [dbo].[GroupUsers]
      where group_id='${group_id}'
    `
    return query(sql)
  }


  // 给组添加角色
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
      )
      VALUES('${group_role_id}','${group_id}','${role_id}','${create_time}','${create_user_id}')
    `
    return query(sql)
  }


  // 获取GroupRole中 组和角色的关系数据 getRoleListFromGroup
  getRoleListFromGroup(group_id) {
    let sql = ''
    if (!group_id) {
      sql = `
        select role_id, group_id from [cniab-rms].[dbo].[GroupRole]
      `
    } else {
      sql = `
        select role_id, group_id from [cniab-rms].[dbo].[GroupRole] where group_id = '${group_id}'
      `
    }
    return query(sql)
  }

  deleteRolesFromGroup(group_id) {
    let sql = `
      delete from [dbo].[GroupRole]
      where group_id='${group_id}'
    `
    return query(sql)
  }
}

module.exports = new GroupModel()