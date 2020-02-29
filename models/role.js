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

  find() {
    let sql = `
      select * from [cniab-rms].[dbo].[Role]
    `
    return query(sql)
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
}

module.exports = new Role()