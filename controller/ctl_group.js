const genUUID = require('../utils/uuid')
const dayjs = require('dayjs')
const {
  getGroupList, createGroup, updateGroupById, deleteGroup,
  getGroupByName, getGroupById, insertUsersIntoGroup
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
    const result = await getGroupList()
    // 遍历用户组以及角色记录, 形成group: {group_id, ..., roles: []}
    // 只显示在用状态
    let data = result.recordset.filter(item => {
      return item.status === 1
    })
    if (result.rowsAffected > 0) {
      ctx.body = {
        status: 0,
        data,
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

  // 给组添加用户
  static async _addUserIntoGroup(group_id, user_ids, create_user_id) {
    let count = 0
    let create_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    for (let index = 0; index < user_ids.length; index++) {
      let user_group_id = genUUID()
      let { rowsAffected } = await insertUsersIntoGroup({ user_group_id, user_id: user_ids[index], group_id, create_time, create_user_id })
      console.log("rowsAffected: ", rowsAffected, " --> ", typeof rowsAffected)
      if (rowsAffected > 0) {
        count++
        console.log("if count ?, ", count)
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
    console.log("finally count: ", count)
    return { count }
  }

  async addUserIntoGroup(ctx) {
    const { group_id, user_ids } = ctx.request.body
    let result = await GroupCtl._addUserIntoGroup(group_id, user_ids, ctx.state.user.user_id)
    console.log("result: ", result)
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

module.exports = new GroupCtl()