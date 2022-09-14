import { onConnect, onbindAccount } from "@/utils/cim.web.sdk.js";
import { filterMemberName } from "@/utils/filterName";
import { received } from "@/api/message";
import { Toast, Dialog } from 'vant';

import store from "../store";
import router from "../router";
import { replyMsg } from "@/utils/replyMsg";
import { getUserInfo } from "@/api/login";
import { getGroupInfo } from "@/api/friend";
import checkSymbol from "@/utils/checkSymbol.js";

/**
 * getQueryVariable
 * @param variable 获取链接参数
 */
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}
const onLogout = () => {
    Dialog.alert({
        title: '账号异地登录',
    })
        .then(() => {
            store.dispatch("user/logout").then(() => {
                router.push("/login");
                window.stopConnect();
            });
        })

};

export function webSocket() {
    if (store.getters.token) {
        onConnect();
    }
    const onConnectFinished = () => {
        let account = String(store.getters.user.id)
        console.log("开始绑定账号:", account);
        onbindAccount(account);
    };
    window.onConnectFinished = onConnectFinished;
    const onReplyReceived = reply => {
        // 上线响应
        // console.log(reply);
        if (reply.key === "client_bind" && reply.code === "200") {
            // console.log("上线响应");
        }
    };
    const fz = [];
    window.onReplyReceived = onReplyReceived;
    const onMessageReceived = async message => {
        const rexp = /^5\d{2}$/;
        // 收消息
        console.log("收到的消息 message", message);
        //检测 是否有@我
        let isT = checkSymbol(message.content);
        console.log("有人@我", isT);
        const { sender, extra, action } = message;
        if (isT) {
            store.commit("user/SET_SYMBOL", {
                sender,
                extra,
                action,
                isT,
                isClick: false
            });
        }
        if (message.action < 900) {
            // 在线接收消息回执 否则为离线消息
            await received(message.id, message.action);
        }
        if (rexp.test(message.action - 0)) {
            console.log("收到朋友圈");
            store.commit("user/UPDETA", true);
            if (message.action == "500") {
                store.commit("user/SET_FZICON", 1);
                localStorage.setItem("offLineFz", 1);
            }
            if (message.action == "502") {
                fz.push({ id: message.id });
                localStorage.setItem("fz", JSON.stringify(fz));
                store.commit("user/SET_FZREPLY", { id: message.id });
            }
            return;
        }
        let replyList = store.getters.replyList;
        let reply;
        replyList.forEach(item => {
            // 根据id判断有没有存储对应的聊天记录
            if (item.id == message.sender) {
                reply = item;
            }
        });
        if (message.action === "100") {
            // 消息已读回执
            let reply;
            replyList.forEach((item, index) => {
                if (item.msgList) {
                    item.msgList.forEach((msg, msgIndex) => {
                        if (msg.id == message.content) {
                            replyList[index].msgList[msgIndex].unread = false;
                            reply = replyList[index];
                        }
                    });
                }
            });
            if (reply) store.dispatch("user/replyList", reply); //存储消息
            return;
        }
        if (message.action === "101") {
            //单聊撤回消息
            const memberInfo = filterMemberName(
                //过滤用户昵称和群成员昵称
                message.sender,
                message.extra,
                message.action
            );
            reply.msgList.forEach((msg, msgIndex) => {
                if (msg.id == message.content) {
                    reply.msgList[msgIndex].action = "100";
                    reply.msgList[msgIndex].tips = memberInfo.name + "撤回了一条消息";
                }
            });
            store.dispatch("user/replyList", reply); //存储消息
            return;
        }
        if (message.action === "105") {
            console.log("在线好友请求");
            // 添加好友请求
            const path = window.location.pathname;
            let applyFriend = {
                action: message.action,
                content: message.content,
                extra: message.extra,
                format: message.format,
                id: message.id,
                receiver: message.receiver,
                sender: message.sender,
                timestamp: message.timestamp,
                title: message.title,
                unread: true,
                status: 0
            };
            const res = await getUserInfo(message.sender);
            if (path === "/contact/new-friends") applyFriend.unread = false;
            store.commit("user/SET_APPLYFRIEND", { ...applyFriend, ...res.data }); //存储消息
            return;
        }
        if (message.action === "106") {
            // 同意加好友
            const res = await getUserInfo(message.sender);
            const reply = {
                id: res.data.id,
                action: "0",
                title: res.data.name,
                msgList: [],
                groups: [],
                motto: res.data.motto,
                badge: 0
            };
            let msgs = {
                msgType: 0,
                msg: "我通过了你的朋友验证请求，现在我们可以开始聊天了"
            };
            reply.msgList.push(msgs);
            store.dispatch("user/replyList", reply); //存储消息
            const baseInfo = JSON.parse(store.getters.baseInfo);
            let friendList = baseInfo.friendList || [];
            friendList.push(res.data);
            baseInfo.friendList = friendList;
            store.commit("user/SET_BASEINFO", baseInfo);
            return;
        }
        if (message.action === "107") {
            const baseInfo = JSON.parse(store.getters.baseInfo);
            let fri = baseInfo.friendList || [];
            let both = baseInfo.bothList || [];
            let contact = baseInfo.contactList || [];
            const isFri = both.find(ele => {
                return ele.id == message.sender;
            });
            if (isFri) {
                both = both.filter(ele => {
                    return ele.id != message.sender;
                });
                contact.push(isFri);
            } else {
                fri = fri.filter(ele => {
                    return ele.id != message.sender;
                });
                let replyList = store.getters.replyList;
                replyList = replyList.filter(el => {
                    // 根据id判断有没有存储对应的聊天记录
                    return message.sender != el.id;
                });
                console.log(replyList);
                store.dispatch("user/replyList", replyList); //存储消息
            }
            baseInfo.friendList = fri;
            baseInfo.bothList = both;
            baseInfo.contactList = contact;
            store.commit("user/SET_BASEINFO", baseInfo);
        }
        if (message.action === "300") {
            // 收到被添加到群
            const { data } = await getGroupInfo(message.sender);
            const res = await getUserInfo(message.extra);
            if (!reply)
                reply = {
                    id: data.id,
                    action: "3",
                    title: data.name,
                    msgList: [],
                    groups: [],
                    motto: data.motto,
                    badge: 0,
                    uid: data.uid,
                    remove: false,
                    state: data.state
                };
            let msgs = {
                msgType: 0,
                msg: res.data.name + "邀请你加入群聊"
            };
            reply.remove = false;
            reply.groups = data.memberList;
            reply.msgList.push(msgs);
            store.dispatch("user/replyList", reply); //存储消息
            const baseInfo = JSON.parse(store.getters.baseInfo);
            let groupList = baseInfo.groupList || [];
            groupList.push(data);
            baseInfo.groupList = groupList;
            store.commit("user/SET_BASEINFO", baseInfo);
            return;
        }
        if (message.action === "301") {
            // 自己被移出群聊
            const baseInfo = JSON.parse(store.getters.baseInfo);
            const { data } = await getGroupInfo(message.sender);
            let groupList = baseInfo.groupList || [];
            if (!reply) {
                // 如果没有回话列表
                reply = {
                    id: message.sender,
                    action: "3",
                    title: data.name,
                    msgList: [],
                    groups: [...data.memberList],
                    motto: data.motto,
                    badge: 0,
                    remove: true,
                    uid: data.uid,
                    state: data.state
                };
            }
            reply.groups = data.memberList;
            reply.remove = true;
            reply.msgList.push(msgs);
            store.dispatch("user/replyList", reply); //存储消息
            groupList.map((item, index) => {
                if (item.id == message.sender) {
                    let msgs = {
                        msgType: 0,
                        msg: "您已被移出群聊"
                    };
                    groupList.splice(index, 1);
                    baseInfo.groupList = groupList;
                    store.commit("user/SET_BASEINFO", baseInfo);
                }
            });
            return;
        }
        if (message.action === "302") {
            // 别人退群消息
            const baseInfo = JSON.parse(store.getters.baseInfo);
            const { data } = await getGroupInfo(message.sender);
            let groupList = baseInfo.groupList || [];
            if (!reply) {
                // 如果没有回话列表
                reply = {
                    id: message.sender,
                    action: "3",
                    title: data.name,
                    msgList: [],
                    groups: [...data.memberList],
                    motto: data.motto,
                    badge: 0,
                    remove: true,
                    uid: data.uid,
                    state: data.state
                };
            }
            reply.groups = data.memberList;
            store.dispatch("user/replyList", reply); //存储消息
            groupList.map((item, index) => {
                if (item.id == message.sender) {
                    groupList[index].memberList = data.memberList;
                    baseInfo.groupList = groupList;
                    store.commit("user/SET_BASEINFO", baseInfo);
                }
            });
            return;
        }
        if (message.action === "303") {
            const baseInfo = JSON.parse(store.getters.baseInfo);
            let groupList = baseInfo.groupList || [];
            groupList.forEach((item, index) => {
                if (item.id == message.sender) {
                    groupList[index].remove = true;
                }
            });
            if (reply) {
                reply.remove = true;
                store.dispatch("user/replyList", reply); //存储消息
            }
            return false;
        }
        if (message.action === "304") {
            // 修改群名称
            const baseInfo = JSON.parse(store.getters.baseInfo);
            const { data } = await getGroupInfo(message.sender);
            let groupList = baseInfo.groupList || [];
            groupList.forEach((item, index) => {
                if (item.id == message.sender) {
                    groupList[index] = data;
                }
            });
            baseInfo.groupList = groupList;
            store.commit("user/SET_BASEINFO", baseInfo);
            if (reply) {
                let msgs = {
                    msgType: 0,
                    msg: '群主修改群名称为为"' + data.name + '"'
                };
                reply.msgList.push(msgs);
                reply.title = data.name;
                store.dispatch("user/replyList", reply); //存储消息
            }
            baseInfo.groupList = groupList;
            store.commit("user/SET_BASEINFO", baseInfo);
            return;
        }
        if (message.action === "305") {
            // 修改群公告
            const baseInfo = JSON.parse(store.getters.baseInfo);
            const { data } = await getGroupInfo(message.sender);
            let groupList = baseInfo.groupList || [];
            const memberInfo = filterMemberName(
                //过滤用户昵称和群成员昵称
                data.uid
            );
            groupList.forEach((item, index) => {
                if (item.id == message.sender) {
                    groupList[index] = data;
                }
            });
            if (reply) {
                let msgs = {
                    action: "3",
                    author: memberInfo.name,
                    extra: message.extra,
                    format: message.format,
                    id: message.id,
                    msg: "群公告<br/>" + message.content,
                    receiver: message.receiver,
                    sender: data.uid,
                    timestamp: message.timestamp,
                    unread: true
                };
                reply.msgList.push(msgs);
                reply.notice = data.notice;
                store.dispatch("user/replyList", reply); //存储消息
            }
            baseInfo.groupList = groupList;
            store.commit("user/SET_BASEINFO", baseInfo);
            return;
        }
        if (message.action === "308") {
            const baseInfo = JSON.parse(store.getters.baseInfo);
            let groupList = baseInfo.groupList || [];
            groupList.forEach((item, index) => {
                if (item.id == message.sender) {
                    groupList[index].state = 1;
                }
            });
            if (reply) {
                reply.state = 1;
                store.dispatch("user/replyList", reply); //存储消息
            }
            baseInfo.groupList = groupList;
            store.commit("user/SET_BASEINFO", baseInfo);
            return false;
        }
        if (message.action === "309") {
            const baseInfo = JSON.parse(store.getters.baseInfo);
            let groupList = baseInfo.groupList || [];
            groupList.forEach((item, index) => {
                if (item.id == message.sender) {
                    groupList[index].state = 0;
                }
            });
            if (reply) {
                reply.state = 0;
                store.dispatch("user/replyList", reply); //存储消息
            }
            baseInfo.groupList = groupList;
            store.commit("user/SET_BASEINFO", baseInfo);
            return false;
        }
        if (message.action === "311") {
            // 收到别人添加到群
            const baseInfo = JSON.parse(store.getters.baseInfo);
            const inviteInfo = await getUserInfo(message.extra);
            const { data } = await getGroupInfo(message.sender);
            let groupList = baseInfo.groupList || [];
            let memberlist = message.content.split(",");
            groupList.map((item, index) => {
                if (item.id == message.sender) {
                    if (reply) {
                        let msg = "";
                        memberlist.forEach(async (ele, eleIndex) => {
                            const res = await getUserInfo(ele);
                            if (eleIndex < 3) {
                                msg = msg + res.name + "、";
                            }
                        });
                        let msgs = {
                            msgType: 0,
                            msg:
                                inviteInfo.data.name +
                                "邀请" +
                                msg.substr(0, msg.length - 1) +
                                "...加入群聊"
                        };
                        reply.msgList.push(msgs);
                        reply.groups = data.memberList;
                        store.dispatch("user/replyList", reply); //存储消息
                    }
                    groupList[index].memberList = data.memberList;
                    baseInfo.groupList = groupList;
                    store.commit("user/SET_BASEINFO", baseInfo);
                }
            });
            return;
        }
        if (message.action === "312") {
            // 收到别人被移出
            const baseInfo = JSON.parse(store.getters.baseInfo);
            const { data } = await getGroupInfo(message.sender);
            let groupList = baseInfo.groupList || [];
            let memberlist = message.content.split(",");
            groupList.map((item, index) => {
                if (item.id == message.sender) {
                    memberlist.forEach(async ele => {
                        const res = await getUserInfo(ele);
                        let msgs = {
                            msgType: 0,
                            msg: res.data.name + "被移出群聊"
                        };
                        if (reply) {
                            reply.msgList.push(msgs);
                            reply.groups = data.memberList;
                            store.dispatch("user/replyList", reply); //存储消息
                        }
                        groupList[index].memberList = data.memberList;
                        baseInfo.groupList = groupList;
                        store.commit("user/SET_BASEINFO", baseInfo);
                    });
                }
            });
            return;
        }
        if (message.action === "999") {
            onLogout();
            return false;
        }
        if (message.action > 4) return;
        let replyMsgs = replyMsg(reply, message);
        store.dispatch("user/replyList", replyMsgs); //存储消息
    };
    window.onMessageReceived = onMessageReceived;
}
