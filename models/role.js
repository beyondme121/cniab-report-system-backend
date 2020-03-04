const { query } = require('../utils/dbUtils')

class Role {
  // 创建角色
  create(role) {
    const { RoleId, RoleName, RoleDesc, CreateUserId, CreateTime, ParentRoleId } = role
    let sql = `
      INSERT INTO [cniab-rms].[dbo].[Role]
      (
        [RoleId]
        ,[RoleName]
        ,[RoleDesc]
        ,[CreateUserId]
        ,[CreateTime]
        ,[ParentRoleId]
      )
      VALUES('${RoleId}', '${RoleName}', '${RoleDesc}','${CreateUserId}','${CreateTime}','${ParentRoleId}')
    `
    return query(sql)
  }

  // 查询所有角色列表
  findAllRoleList() {
    let sql = `
      select * from [cniab-rms].[dbo].[Role]
    `
    return query(sql)
  }

  // 查询所有的角色菜单
  findAllRoleMenuList() {
    let sql = `
      select a.RoleMenuId, RoleId, a.MenuId, b.MenuNameEN, b.MenuNameCN, b.MenuPath, b.Status
      FROM [cniab-rms].[dbo].[RoleMenu] a LEFT JOIN dbo.Menu b ON a.MenuId=b.MenuId
    `
    return query(sql)
  }


  // 根据角色id查询角色详细信息
  findByRoleId(RoleId) {
    let sql = `
        SELECT [RoleId]
              ,[RoleName]
              ,[RoleDesc]
              ,[CreateUserId]
              ,[CreateTime]
              ,[ModifyUserId]
              ,[ModifyTime]
              ,[AuthTime]
              ,[AuthUserId]
              ,[ParentRoleId]
        FROM [cniab-rms].[dbo].[Role]
        WHERE [RoleId]='${RoleId}'
    `
    return query(sql)
  }

  // 根据角色id查询角色所具有的菜单权限数组
  findRoleMenusByRoleId(RoleId) {
    let sql = `
        SELECT a.[RoleId]
              ,a.[MenuId]
              ,b.MenuPath
              ,b.MenuNameEN
        FROM [cniab-rms].[dbo].[RoleMenu] a INNER JOIN dbo.Menu b ON a.MenuId=b.MenuId
        WHERE RoleId='${RoleId}'
    `
  }

  findByName(roleName) {
    let sql = `
        SELECT [RoleId]
              ,[RoleName]
              ,[RoleDesc]
              ,[CreateUserId]
              ,[CreateTime]
              ,[ModifyUserId]
              ,[ModifyTime]
              ,[ParentRoleId]
        FROM [cniab-rms].[dbo].[Role]
        WHERE RoleName='${roleName}'
    `
    return query(sql)
  }

  // 更新角色的基础信息
  updateRoleBaseInfo({ RoleId, AuthTime, AuthUserId }) {
    let sql = `
      UPDATE [cniab-rms].[dbo].[Role]
      SET AuthTime='${AuthTime}', [AuthUserId]='${AuthUserId}'
      WHERE RoleId='${RoleId}'
    `
    return query(sql)
  }


  // 删除某个角色id的所有菜单
  deleteRoleMenusByRoleId(RoleId) {
    let sql = `
      DELETE FROM [cniab-rms].[dbo].[RoleMenu]
      WHERE RoleId='${RoleId}'
    `
    return query(sql)
  }

  // 插入某个角色的菜单
  insertRoleMenus(role) {
    const { RoleMenuId, RoleId, MenuId, CreateTime } = role
    let sql = `
      INSERT INTO [cniab-rms].[dbo].[RoleMenu](RoleMenuId,RoleId,MenuId,CreateTime)
      VALUES('${RoleMenuId}','${RoleId}','${MenuId}','${CreateTime}')
    `
    return query(sql)
  }
}

module.exports = new Role()