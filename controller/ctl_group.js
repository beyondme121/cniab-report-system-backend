const genUUID = require('../utils/uuid')
const dayjs = require('dayjs')
const {
  getGroupList, createGroup, updateGroupById, deleteGroup,
  getGroupByName, getGroupById, insertUsersIntoGroup, getUserListFromGroup,
  deleteUsersFromGroup, insertRoleIntoGroup, deleteRolesFromGroup, getRoleListFromGroup
} = require('../models/group')

class GroupCtl {
  // 中间件, 校验组名是否存在
  async checkGroupExist(ctx, next) {
    const { group_name, group_id } = ctx.request.body
    const { recordset } = await getGroupByName(group_name)
    const result = await getGroupById(group_id)
    // let groupNameArr = recordset.reduce((pre, item) => {
    //   pre.push(item.group_name)
    //   return pre
    // }, [])
    // 如果更新的名称不存在 或者
    // 更新自己(通过group_id查询组的结果,
    // 如果组的名称与前端传递过来的组的名称一致,就是更新自己, 也就是说没有修改组名称,只更新了组的其他信息)
    if (
      // groupNameArr.length === 0 ||
      // groupNameArr.length >= 1 && result.recordset[0].group_name === group_name
      recordset.length === 0 ||
      result.recordset[0].group_name === group_name
    ) {
      await next()
    } else {
      ctx.body = {
        status: 1,
        msg: '用户组名称被占用'
      }
    }
  }

  // 获取用户组列表
  async getUserGroupList(ctx) {
    // 获取用户组基本信息
    const res1 = await getGroupList()
    // 获取用户组中的所有用户
    const res2 = await getUserListFromGroup()
    // 获取用户组中的所有角色
    const res3 = await getRoleListFromGroup()
    res1.recordset.forEach(group => {
      let user_ids = []
      let role_ids = []
      res2.recordset.forEach(item => {
        if (group.group_id === item.group_id) {
          user_ids.push(item.user_id)
        }
      })
      res3.recordset.forEach(item => {
        if (group.group_id === item.group_id) {
          role_ids.push(item.role_id)
        }
      })
      group.user_ids = user_ids
      group.role_ids = role_ids
    })

    if (res1.rowsAffected > 0) {
      ctx.body = {
        status: 0,
        data: res1.recordset,
        msg: '成功'
      }
    } else {
      ctx.body = {
        status: 1,
        data: [],
        msg: '查无数据'
      }
    }
  }

  // 添加用户所属的组
  async addUserGroup(ctx) {
    const { parent_group_id, group_name, group_desc } = ctx.request.body
    let group_id = genUUID()
    const { user_id, user_name, exp } = ctx.state.user
    let create_time = dayjs().format('YYYY-MM-DD HH:mm:ss')  // .locale('zh-cn')
    let group = {
      group_id, parent_group_id, group_name, group_desc, user_id, create_time
    }
    const result = await createGroup(group)
    if (result.rowsAffected > 0) {
      ctx.body = {
        status: 0,
        data: group,
        msg: '创建组成功'
      }
    } else {
      ctx.body = {
        status: 1,
        data: {},
        msg: '创建组失败'
      }
    }
  }

  // 更新组
  async updateUserGroup(ctx) {
    const { group_id, parent_group_id, group_name, group_desc } = ctx.request.body
    const { user_id, user_name } = ctx.state.user
    let update_time = dayjs().format('YYYY-MM-DD HH:mm:ss')  // .locale('zh-cn')
    let group = {
      group_id, parent_group_id, group_name, group_desc,
      update_user_id: user_id, update_time
    }
    const result = await updateGroupById(group)
    if (result.rowsAffected > 0) {
      ctx.body = {
        status: 0,
        data: group,
        msg: '更新组成功'
      }
    } else {
      ctx.body = {
        status: 1,
        data: {},
        msg: '更新组失败'
      }
    }
  }

  // 删除组
  async deleteUserGroup(ctx) {
    const group = ctx.request.body
    const result = await deleteGroup(group.group_id)
    if (result.rowsAffected > 0) {
      ctx.body = {
        status: 0,
        data: group
      }
    } else {
      ctx.body = {
        status: 1,
        data: group
      }
    }
  }

  // 给组添加用户前的数据整理
  static async _addUserIntoGroup(group_id, user_ids, create_user_id) {
    let count = 0
    let create_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    for (let index = 0; index < user_ids.length; index++) {
      let user_group_id = genUUID()
      let { rowsAffected } = await insertUsersIntoGroup({ user_group_id, user_id: user_ids[index], group_id, create_time, create_user_id })
      if (rowsAffected > 0) {
        count++
      }
    }
    // user_ids.forEach(async user_id => {
    //   let user_group_id = genUUID()
    //   let { rowsAffected } = await insertUsersIntoGroup({ user_group_id, user_id, group_id, create_time, create_user_id })
    //   console.log("rowsAffected: ", rowsAffected, " --> ", typeof rowsAffected)
    //   if (rowsAffected > 0) {
    //     count++
    //     console.log("if count ?, ", count)
    //   }
    // })
    return { count }
  }

  // 给组添加用户群
  async addUserIntoGroup(ctx) {
    const { group_id, user_ids } = ctx.request.body
    // 1. 通过group_id查找groupUser表,是否存在, 存在才进行删除
    const result = await getUserListFromGroup(group_id)
    if (result.rowsAffected > 0) {
      // 2. 删除UserGroup中所有组中的用户, 然后才能插入
      let delRes = await deleteUsersFromGroup(group_id)
      if (delRes.rowsAffected > 0) {
        let result = await GroupCtl._addUserIntoGroup(group_id, user_ids, ctx.state.user.user_id)
        if (result.count === user_ids.length) {
          ctx.body = {
            status: 0,
            msg: '给用户组添加用户列表成功'
          }
        } else {
          ctx.body = {
            status: 1,
            msg: '给用户组添加用户列表失败'
          }
        }
      } else {
        ctx.body = {
          status: 1,
          msg: '删除组中的用户失败'
        }
      }
    } else {
      let result = await GroupCtl._addUserIntoGroup(group_id, user_ids, ctx.state.user.user_id)
      if (result.count === user_ids.length) {
        ctx.body = {
          status: 0,
          msg: '给用户组添加用户列表成功'
        }
      } else {
        ctx.body = {
          status: 1,
          msg: '给用户组添加用户列表失败'
        }
      }
    }
  }

  // 给组添加角色前的数据整理
  static async _addRoleIntoGroup(group_id, role_ids, create_user_id) {
    let count = 0
    let create_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    for (let index = 0; index < role_ids.length; index++) {
      let group_role_id = genUUID()
      let { rowsAffected } = await insertRoleIntoGroup({ group_role_id, role_id: role_ids[index], group_id, create_time, create_user_id })
      if (rowsAffected > 0) {
        count++
      }
    }
    return { count }
  }


  async addRoleIntoGroup(ctx) {
    const { group_id, role_ids } = ctx.request.body
    const result = await getRoleListFromGroup(group_id)
    if (result.rowsAffected > 0) {
      // 2. 删除GroupRole中所有组中的角色, 然后才能插入
      let delRes = await deleteRolesFromGroup(group_id)
      if (delRes.rowsAffected > 0) {
        let result = await GroupCtl._addRoleIntoGroup(group_id, role_ids, ctx.state.user.user_id)
        if (result.count === role_ids.length) {
          ctx.body = {
            status: 0,
            msg: '给用户组添加角色列表成功'
          }
        } else {
          ctx.body = {
            status: 1,
            msg: '给用户组添加角色列表失败'
          }
        }
      } else {
        ctx.body = {
          status: 1,
          msg: '删除组中的角色失败'
        }
      }
    } else {
      let result = await GroupCtl._addRoleIntoGroup(group_id, role_ids, ctx.state.user.user_id)
      if (result.count === role_ids.length) {
        ctx.body = {
          status: 0,
          msg: '给用户组添加角色列表成功'
        }
      } else {
        ctx.body = {
          status: 1,
          msg: '给用户组添加角色列表失败'
        }
      }
    }
  }
}

module.exports = new GroupCtl()