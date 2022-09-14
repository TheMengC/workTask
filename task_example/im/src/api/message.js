import request from "@/utils/request";
/**
 * @params {Object}
 * @description 发送聊天消息
 */
export function sendMsg(params) {
  return request({
    url: "/message",
    method: "post",
    data: params
  });
}
/**
 * @params {Object}
 * @description 获取离线消息
 */
export function getOfflineMessage(params) {
  return request({
    url: "/message/list/offline",
    method: "get",
    data: params
  });
}
/**
 * @bucket 后台约定的唯一标识
 * @key 前端生成的唯一uid
 * @data formData图片、视频、文件数据流
 * @description 上传聊天附件文件图片视频
 */
export function upLoad(bucket, key, data, fileType = 1) {
  return request({
    url: `/file/${bucket}/${key}`,
    method: "post",
    data,
    headers: {
      "file-type": fileType
    }
  });
}
/**
 * @id {string||init} 消息id
 * @description 消息已接收回执
 */
export function received(id, action) {
  return request({
    url: `/message/receive/${id}?action=${action}`,
    method: "post"
  });
}
/**
 * @{}
 * @description 批量消息已接收回执
 */
export function receivedAll() {
  return request({
    url: `/message/receive/all`,
    method: "post"
  });
}
/**
 * @id {string||init} 消息id
 * @description 消息已读回执
 */
export function readed(id) {
  return request({
    url: `/message/read/${id}`,
    method: "post"
  });
}
/**
 * @id {string||init} 消息id
 * @receiver {string||init} 对方id
 * @description 消息已读回执并通知对方
 */
export function readedNotice(id, receiver) {
  return request({
    url: `/message/read/${id}/${receiver}`,
    method: "post"
  });
}

/**
 * @id {string||init} 消息id
 * @description 撤回消息
 */
export function revokeMsg(id, action) {
  return request({
    url: `/message/revoke/${id}?action=${action}`,
    method: "delete"
  });
}

/**
 * @currentPage 页数
 * @description 获取表情库列表
 */
export function emoticonMail(currentPage) {
  return request({
    url: `/emoticon/mall/list/${currentPage}`,
    method: "get"
  });
}
/**
 * @id {string||init} 表情包id
 * @description 获取表情包列表
 */
export function emoticon(id) {
  return request({
    url: `/emoticon/item/list/${id}`,
    method: "get"
  });
}
//下载聊天文件
export function downFile(bucket, key) {
         return request({
           url: `/file/${bucket}/${key}`,
           method: "get",
         });
       }
