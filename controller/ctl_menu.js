const genUUID = require('../utils/uuid')
const dayjs = require('dayjs')
// 引入model层  -- 负责数据库查询
const { findMenuList, create, findByMenuId, findMenuIcons } = require('../models/menu')

class Menu {

  // 检查角色名称唯一性的中间件
  // async checkRoleExist(ctx, next) {
  //   const result = await findByName(ctx.request.body.RoleName)
  //   console.log(result.recordset)
  //   if (result.recordset.length !== 0) {
  //     ctx.body = {
  //       status: 1,
  //       msg: '角色名称重复'
  //     }
  //   } else {
  //     await next()
  //   }
  // }

  async create(ctx) {
    // 校验请求体参数
    // ctx.verifyParams({
    //   RoleName: { type: 'string', required: true }
    // })
    let {
      ParentMenuId, MenuNameEN, MenuNameCN, MenuIcon,
      MenuDescrition, MenuPath, SortKey, RootDistance
    } = ctx.request.body

    let MenuId = genUUID()
    let MenuCreateUserId = 'xxx'
    let MenuCreateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    let Status = 1
    // ParentMenuId = ParentMenuId === '0000' ? MenuId : ParentMenuId

    // 查询父级Menu信息, 根据Menu信息
    console.log("ParentMenuId: ", ParentMenuId)
    const ParentMenuObj = await findByMenuId(ParentMenuId)
    console.log("ParentMenuObj:", ParentMenuObj)
    console.log("================", ParentMenuId, ParentMenuId === '0000')
    console.log("MenuPath.slice(1) =====, ", MenuPath.slice(1))
    MenuPath =
      ParentMenuObj.recordset[0].ParentMenuId === '0000' ?
        MenuPath         // 去掉根路径的 "/"
        : ParentMenuObj.recordset[0].MenuPath + MenuPath

    const result = await create({
      MenuId, ParentMenuId, MenuNameEN, MenuNameCN, MenuIcon,
      MenuDescrition, MenuPath, MenuCreateTime, MenuCreateUserId,
      SortKey, RootDistance, Status
    })
    if (result.rowsAffected > 0) {
      ctx.body = {
        status: 0,
        msg: '添加菜单成功',
        data: {
          MenuId, ParentMenuId, MenuNameEN, MenuNameCN, MenuIcon,
          MenuDescrition, MenuPath, SortKey, RootDistance,
          MenuCreateUserId, MenuCreateTime, Status
        }
      }
    } else {
      ctx.body = {
        status: 1,
        msg: '添加失败',
        data: ''
      }
    }
  }

  async findMenus(ctx) {
    const result = await findMenuList()
    if (result.rowsAffected > 0) {
      ctx.body = {
        status: 0,
        msg: '查询菜单成功',
        data: result.recordset
      }
    } else {
      ctx.body = {
        status: 1,
        msg: '查询菜单失败',
        data: ''
      }
    }
  }

  // 根据菜单id查询菜单信息
  async findById(MenuId) {
    const result = await findByMenuId(MenuId)
    console.log("result.recordset[0]", result.recordset[0])
    if (result.rowsAffected > 0) {
      return result.recordset[0]
    }
  }

  // 获取菜单图标
  async findMenuIcons(ctx) {
    const result = await findMenuIcons()
    if (result.rowsAffected > 0) {
      ctx.body = {
        status: 0,
        msg: '查询菜单图标成功',
        data: result.recordset
      }
    } else {
      ctx.body = {
        status: 1,
        msg: '查询菜单图标失败',
        data: ''
      }
    }
  }
}

module.exports = new Menu()