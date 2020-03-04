const genUUID = require('../utils/uuid')
const dayjs = require('dayjs')
const {
  getGroupList, createGroup, updateGroupById,
  getGroupByName, getGroupById
} = require('../models/group')

class GroupCtl {
  // 中间件, 校验组名是否存在
  async checkGroupExist(ctx, next) {
    const { group_name, group_id } = ctx.request.body
    const { rowsAffected, recordset } = await getGroupByName(group_name)
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
      rowsAffected === 0 ||
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



  async getUserGroupList(ctx) {
    const result = await getGroupList()
    if (result.rowsAffected > 0) {
      ctx.body = {
        status: 0,
        data: result.recordset,
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
}

module.exports = new GroupCtl()