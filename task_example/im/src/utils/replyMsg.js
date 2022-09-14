import { filterGroup, filterMemberName } from '@/utils/filterName'
const emoJSON = require('@/mock/emojLocal.js')
import config from '../config'
/**
 * getQueryVariable
 * @param variable 获取链接参数
 */
function getQueryVariable(variable) {
    var query = window.location.search.substring(1)
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] == variable) {
            return pair[1]
        }
    }
    return false
}
/**
 * emojReplace
 * @param string 获取表情包
 */
const emojReplace = (string) => {
    //正则匹配表情
    // 获取标签图片
    string.replace(/{([^}]+)}/g, function (match, capture) {
        let url = ''
        for (let i = 0; i < emoJSON[0].nodes.length; i++) {
            const element = emoJSON[0].nodes[i]
            if (element.name == match) {
                url = element.url
            }
        }
        let outHtml = ''
        //判断是否为大表情
        console.log(url, match, capture)
        outHtml = '<img src="' + url + '" class="face" />'
        string = string.replace(match, outHtml)
    })

    return string
}
/**
 * replyMsg
 * @param {reply, message} 本地消息和获取的消息
 */
export function replyMsg(reply, message) {
    const path = window.location.pathname
    let msgLs
    let arrLS
    let group = {
        memberList: [],
    }
    // console.log(
    //   "message.content",
    //   message.content
    //     .split("\n").filter(item=>!!item).join('<br/>')
    // );
    // console.log("message", message);
    message.content = message.content
        .split('\n')
        .filter((item) => !!item)
        .join('<br/>')
    if (message.action == '3') group = filterGroup(message.sender) // 群消息过滤群的信息
    const memberInfo = filterMemberName(
        //过滤用户昵称和群成员昵称
        message.sender,
        message.extra,
        message.action,
    )
    // console.log('memberInfo', memberInfo)
    if (reply) {
        // 已聊天消息处理
        msgLs = reply.msgList
        arrLS = {
            id: message.id,
            format: message.format || '',
            action: message.action || '',
            sender: message.sender || '', // 个人相对发送人id
            receiver: message.receiver || '', // 接收人或者群id
            author: memberInfo.name || '', // 发送人昵称
            unread: true,
            timestamp: message.timestamp || '',
            createTime: message.createTime || '',
            msg: message.content || '',
            // 图片消息或者视频封面图字段
            imgsrc:
                message.format == '1' || message.format == '3' || message.format == '5'
                    ? config.baseUrl +
                    '/file/hoxin-chat-space/' +
                    JSON.parse(message.content).image
                    : '',
            videosrc: message.format == '3' ? JSON.parse(message.content).video : '',
            emojsrc: message.format == '15' ? JSON.parse(message.content).itemId : '',
            title: message.title || '',
            extra: message.extra || '', // 群消息 记录发群消息成员的id
            fileName: message.format == '4' ? JSON.parse(message.content).name : '', //附件名称
            fileSize: message.format == '4' ? JSON.parse(message.content).size : '', //附件尺寸
        }
        if (message.format == '0') {
            arrLS.msg = emojReplace(message.content)
        }
    } else {
        // 没有聊天消息处理
        reply = {
            id: message.sender,
            action: message.action,
            title: message.action == '3' ? group.name : memberInfo.name, // 群名称或者个人名称
            msgList: [],
            groups: [...group.memberList], // 群成员
            motto: memberInfo.motto, //签名
            badge: 0,
            remove: false,
            uid: group.uid,
        }
        msgLs = reply.msgList
        arrLS = {
            id: message.id,
            format: message.format, // 消息类型 图片 视频 文件 文字
            action: message.action,
            sender: message.sender,
            receiver: message.receiver,
            author: memberInfo.name,
            unread: true,
            timestamp: message.timestamp,
            msg: message.content,
            imgsrc:
                message.format == '1' || message.format == '3' || message.format == '5'
                    ? config.baseUrl +
                    '/file/hoxin-chat-space/' +
                    JSON.parse(message.content).image
                    : '',
            videosrc: message.format == '3' ? JSON.parse(message.content).video : '',
            emojsrc: message.format == '15' ? JSON.parse(message.content).itemId : '',
            title: message.title,
            extra: message.extra,
            fileName: message.format == '4' ? JSON.parse(message.content).name : '',
            fileSize: message.format == '4' ? JSON.parse(message.content).size : '',
        }
        if (message.format == '0') {
            arrLS.msg = emojReplace(message.content)
        }
    }
    if (path !== '/chat/group-chat') {
        // 根据当前页面判断未读
        reply.badge = reply.badge + 1
        arrLS.unread = true
    } else if (
        path === '/chat/group-chat' &&
        getQueryVariable('id') != message.sender
    ) {
        // 根据当前页面判断未读
        reply.badge = reply.badge + 1
        arrLS.unread = true
    } else {
        arrLS.unread = true
    }
    msgLs = msgLs.concat(arrLS)
    reply.msgList = msgLs
    return reply
}
