const { query } = require('../utils/dbUtils')

class GroupModel {
  // 1. 获取组列表
  getGroupList() {
    // let sql = `
    //   SELECT [group_id]
    //       ,[parent_group_id]
    //       ,[group_name]
    //       ,[group_desc]
    //       ,[create_user_id]
    //       ,[create_time]
    //       ,[update_user_id]
    //       ,[update_time]
    //       ,[status]
    //   FROM [cniab-rms].[dbo].[Group]
    // `
    let sql = `
        SELECT  a.[group_id],
                a.[parent_group_id],
                a.[group_name],
                a.[group_desc],
                a.[create_user_id],
                a.[create_time],
                b.user_name create_user_name,
                c.user_name update_user_name,
                a.[update_time],
                a.[status],
                d.role_id
        FROM [cniab-rms].[dbo].[Group] a INNER JOIN [cniab-rms].[dbo].Users b ON a.create_user_id=b.user_id
        INNER JOIN [cniab-rms].[dbo].Users c ON a.update_user_id=c.user_id
        LEFT JOIN [cniab-rms].[dbo].GroupRole d ON d.group_id = a.group_id
    `
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

}

module.exports = new GroupModel()