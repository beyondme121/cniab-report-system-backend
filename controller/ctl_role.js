const genUUID = require('../utils/uuid')
const dayjs = require('dayjs')
// 引入model层  -- 负责数据库查询
const {
  findAllRoleList, findAllRoleMenuList, create, findByRoleId, findByName,
  updateRoleBaseInfo, deleteRoleMenusByRoleId, insertRoleMenus
} = require('../models/role')

class Role {

  // 检查角色名称唯一性的中间件
  async checkRoleExist(ctx, next) {
    const result = await findByName(ctx.request.body.RoleName)
    console.log(result.recordset)
    if (result.recordset.length !== 0) {
      ctx.body = {
        status: 1,
        msg: '角色名称重复'
      }
    } else {
      await next()
    }
  }

  async create(ctx) {
    // 校验请求体参数
    ctx.verifyParams({
      RoleName: { type: 'string', required: true }
    })
    const { RoleName, RoleDesc, ParentRoleId } = ctx.request.body
    let RoleId = genUUID()
    let CreateUserId = 'xxx'
    let CreateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

    const result = await create({ RoleId, RoleName, RoleDesc, CreateUserId, CreateTime, ParentRoleId })
    if (result.rowsAffected > 0) {
      ctx.body = {
        status: 0,
        msg: '添加角色成功',
        data: { RoleId, RoleName, RoleDesc, CreateUserId, CreateTime, ParentRoleId }
      }
    } else {
      ctx.body = {
        status: 1,
        msg: '添加失败',
        data: ''
      }
    }
  }

  // 获取角色列表 以及角色所对应的菜单
  async getRoleListWithMenus(ctx, next) {
    // const role_info = await findAllRoleList()
    // const role_menu = await findAllRoleMenuList()
    const result = await Promise.all([findAllRoleList(), findAllRoleMenuList()])
    // 角色 和 角色菜单数组
    const role_info = result[0].recordset
    const role_menu = result[1].recordset
    if (role_info.length > 0) {
      let role_result = []
      role_info.forEach(role => {
        let role_item = {}
        let menu_ids = []
        let menu_path = []
        role_menu.forEach(menu => {
          if (role.RoleId === menu.RoleId) {
            menu_ids.push(menu.MenuId)
            menu_path.push(menu.MenuPath)
          }
        })
        role_item = role
        role_item.menu_ids = menu_ids
        role_item.menu_path = menu_path
        role_result.push(role_item)
      })
      ctx.body = {
        status: 0,
        msg: '查询角色成功',
        data: role_result
      }
    } else {
      ctx.body = {
        status: 1,
        msg: '查询角色失败',
        data: ''
      }
    }
  }

  // 根据角色id查询角色信息以及角色对应的菜单
  async findByRoleId(ctx) {
    const roleInfo = await findByRoleId(ctx.request.body.RoleId)
    const menusInfo = await findRoleMenusByRoleId(ctx.request.body.RoleId)
  }

  async findByRoleName(ctx) {

  }

  // 更新角色的基础信息,包含授权人 授权时间等
  async updateRoleInfo(ctx) {
    let { RoleId, AuthTime, AuthUserId, menus } = ctx.request.body
    // 更新角色基本信息
    await updateRoleBaseInfo({ RoleId, AuthTime, AuthUserId })
    // 更新角色的权限
    // 1. 如果角色有对应的菜单, 先删除
    await deleteRoleMenusByRoleId(RoleId)
    // 2. 插入数据
    menus.forEach(async menu => {
      let RoleMenuId = genUUID()
      await insertRoleMenus({
        RoleMenuId,
        RoleId,
        MenuId: menu,
        CreateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
      })
    })
    ctx.body = {
      status: 0,
      msg: '成功'
    }
  }
}

module.exports = new Role()