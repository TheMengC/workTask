import request from '@/utils/request'
/**
 * @params {id} 好友id
 * @description 好友申请
 */
export function applyFriend(fid, message) {
  return request({
    url: `/friend/apply/${fid}?message=${message}`,
    method: 'post',
  })
}
/**
 * @params {id} 好友id
 * @description 同意好友申请
 */
export function agreeFriend(fid) {
  return request({
    url: `/friend/agree/${fid}`,
    method: 'post',
  })
}
/**
 * @params {id} 好友id
 * @description 删除好友
 */
export function deleteFriend(fid) {
  return request({
    url: `/friend/${fid}`,
    method: 'delete',
  })
}

/**
 * @params {id} 好友id
 * @description 邀请进群
 */
export function applyGroup(data) {
  return request({
    url: `/group/invite`,
    method: 'post',
    data,
  })
}

/**
 * @params {id} 群id
 * @description 获取群详情
 */
export function getGroupInfo(id) {
  return request({
    url: '/group/' + id,
    method: 'get',
  })
}

/**
 * @params {id} 群id
 * @description 退群
 */
export function quitGroup(id) {
  return request({
    url: `/group/member/quit/${id}`,
    method: 'delete',
  })
}
/**
 * @params {id} 群id
 * @description 移除群成员
 */
export function removeGroupMember(data) {
  return request({
    url: `/group/member/delete`,
    method: 'post',
    data,
  })
}

/**
 * @params {id, name} 群id 名称
 * @description 修改群名称
 */
export function editGroupName(id, params) {
  return request({
    url: `/group/${id}/name`,
    method: 'PATCH',
    params,
  })
}
/**
 * @params {id, name} 群id 公告
 * @description 修改群公告
 */
export function editGroupNotice(id, params) {
  return request({
    url: `/group/${id}/notice`,
    method: 'PATCH',
    params,
  })
}
/**
 * @params {id, name} 解散群组
 * @description 解散群组
 */
export function disbandGroup(id) {
  return request({
    url: `/group/${id}`,
    method: 'delete',
  })
}
/**
 * @params {id, name} 创建群组
 * @description 创建群组
 */
export function createGroup(data) {
  return request({
    url: `/group`,
    method: 'post',
    data,
  })
}
/**
 * @params {id, name} 群组禁言
 * @description 群组禁言
 */
export function forbidden(id) {
  return request({
    url: `/group/block/${id}`,
    method: 'post',
  })
}
/**
 * @params {id, name} 群组解除禁言
 * @description 群组解除禁言
 */
export function unforbidden(id) {
  return request({
    url: `/group/block/${id}`,
    method: 'delete',
  })
}

/**
 * @params {telephone} 用户电话
 * @description 根据电话获取id
 */
export function getUserId(telephone) {
  return request({
    url: `/user/id/${telephone}`,
    method: 'get',
  })
}
/**
 * @params {telephone} 用户电话
 * @description 根据电话获取id
 */
export function FindUser(telephone) {
  return request({
    url: `/user/find/${telephone}`,
    method: 'get',
  })
}
/**
 * @params {telephone}
 * @description 获取好友列表
 */
export function getFrindList() {
  return request({
    url: `/friend/list`,
    method: 'get',
  })
}
