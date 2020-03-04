const { query } = require('../utils/dbUtils')

class Menu {
  // 创建角色
  create(menu) {
    const {
      MenuId, ParentMenuId, MenuNameEN, MenuNameCN, MenuIcon,
      MenuDescrition, MenuPath, MenuCreateTime, MenuCreateUserId,
      SortKey, RootDistance, Status
    } = menu
    let sql = `
      INSERT INTO [cniab-rms].[dbo].[Menu]
      ([MenuId]
      ,[ParentMenuId]
      ,[MenuNameEN]
      ,[MenuNameCN]
      ,[MenuIcon]
      ,[MenuDescrition]
      ,[MenuPath]
      ,[MenuCreateTime]
      ,[MenuCreateUserId]
      ,[SortKey]
      ,[RootDistance]
      ,[Status])
      VALUES (
        '${MenuId}', '${ParentMenuId}', '${MenuNameEN}','${MenuNameCN}','${MenuIcon}','${MenuDescrition}',
        '${MenuPath}', '${MenuCreateTime}', '${MenuCreateUserId}',${SortKey},${RootDistance},${Status}
      )
    `
    return query(sql)
  }

  findMenuList() {
    let sql = `
      select * from [cniab-rms].[dbo].[Menu]
    `
    return query(sql)
  }

  findByMenuId(id) {
    let sql = `
        SELECT [MenuId]
              ,[ParentMenuId]
              ,[MenuNameEN]
              ,[MenuNameCN]
              ,[MenuIcon]
              ,[MenuDescrition]
              ,[MenuPath]
              ,[MenuCreateTime]
              ,[MenuCreateUserId]
              ,[SortKey]
              ,[RootDistance]
              ,[Status]
        FROM [cniab-rms].[dbo].[Menu]
        WHERE MenuId='${id}'
    `
    return query(sql)
  }

  findMenuIcons() {
    let sql = `
        SELECT [IconId]
              ,[IconText]
              ,IconName
        FROM [cniab-rms].[dbo].[Icons]
    `
    return query(sql)
  }
}

module.exports = new Menu()