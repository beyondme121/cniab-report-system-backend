const { query } = require('../utils/dbUtils')

class GroupModel {
  // 1. 获取组列表
  getGroupList() {
    let sql = `
      SELECT [group_id]
          ,[parent_group_id]
          ,[group_name]
          ,[group_desc]
          ,[create_user_id]
          ,[create_time]
          ,[update_user_id]
          ,[update_time]
          ,[status]
      FROM [cniab-rms].[dbo].[Group]
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

}

module.exports = new GroupModel()