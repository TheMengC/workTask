import store from "../store";
import { replyMsg } from "@/utils/replyMsg";
import Cache from "@/utils/cache";
import { getUserInfo } from "@/api/login";
import { receivedAll } from "@/api/message";
/**
 * Filter message
 * @param data 单聊消息处理
 */
function singleChat(item, id) {
  console.log('singleChat item, id',item, id)
  // 单聊消息处理
  let reply;
  let isExist;
  const replyList = JSON.parse(Cache.getItem(String(id)));
  console.log('singleChat replyList',replyList)
  if (!replyList) {
    const filterMsg = replyMsg(null, item);
    store.dispatch("user/replyList", filterMsg); //存储消息
  } else {
    replyList.forEach((msg) => {
      // 根据id判断有没有存储对应的聊天记录
      if (msg.id == item.sender) {
        reply = msg;
      }
    });
    if (reply) {
      isExist = reply.msgList.find((unit) => {
        return unit.id == item.id;
      });
      if (!isExist) {
        const filterMsg = replyMsg(reply, item);
        store.dispatch("user/replyList", filterMsg); //存储消息
      }
    } else {
      const filterMsg = replyMsg(null, item);
      store.dispatch("user/replyList", filterMsg); //存储消息
    }
  }
}

/**
 * Filter message
 * @param data 消息回执
 */
function backMsg(item, id) {
  const replyList = JSON.parse(Cache.getItem(String(id)));
  let reply;
  if (!replyList) return;
  replyList.forEach((msg, index) => {
    if (msg.msgList) {
      msg.msgList.find((unit, msgIndex) => {
        if (unit.id == item.id) {
          replyList[index].msgList[msgIndex].unread = false;
          reply = replyList[index];
          store.dispatch("user/replyList", reply); //存储消息
        }
        return unit.id == item.id;
      });
    }
  });
}

/**
 * Filter message
 * @param data 消息
 */
const fz = [];
export default function filterMessage(data, id) {
  return new Promise((resolve) => {
    // 所有离线消息转化为已接收
    receivedAll();
    data.forEach((item) => {
      switch (item.action) {
        case "2":
          console.log("系统消息");
          singleChat(item, id);
          break;
        case "0":
          console.log("单聊消息");
          singleChat(item, id);
          break;
        case "3":
          console.log("群消息");
          singleChat(item, id);
          break;
        case "100":
          console.log("回执已读");
          backMsg(item, id);
          break;
        case "101":
          console.log("消息被撤回");
          break;
        case "102":
          console.log("好友改头像");
          break;
        case "103":
          console.log("好友改名称");
          break;
        case "104":
          console.log("好友改签名");
          break;
        case "105":
          offline(item)
          break;
        case "106":
          console.log("同意加好友");
          break;
        case "107":
          console.log("被删除好友");
          break;
        case "300":
          console.log("你被添进群");
          break;
        case "301":
          console.log("你被移出群");
          break;
        case "302":
          console.log("有人退出群");
          break;
        case "303":
          console.log("群组被解散");
          break;
        case "304":
          console.log("修改群名称");
          break;
        case "305":
          console.log("修改群公告");
          break;
        case "308":
          console.log("群组被禁言");
          break;
        case "309":
          console.log("群解除禁言");
          break;
        case "310":
          console.log("撤回群消息");
          break;
        case "311":
          console.log("别人加入群");
          break;
        case "312":
          console.log("别人离开群");
          break;
        case "400":
          console.log("别人加入组织");
          break;
        case "401":
          console.log("别人离开组织");
          break;
        case "402":
          console.log("别人离开组织");
          break;
        case "403":
          console.log("我被移出组织");
          break;
        case "500":
          console.log("有新动态-这是离线消息");
          localStorage.setItem("offLineFz", 1);
          store.commit("user/SET_FZICON", 1);
          break;
        case "501":
          console.log("删除动态");
          break;
        case "502":
          console.log("有人评论、点赞", item);
          fz.push({ id: item.id });
          localStorage.setItem("fz", JSON.stringify(fz));
          store.commit("user/SET_FZREPLY", { id: item.id });
          break;
        case "503":
          console.log("删除评论、点赞");
          break;
        case "504":
          console.log("修改封面");
          break;
        case "200":
          console.log("收到消息");
          break;
        case "202":
          console.log("信息更新");
          break;
        case "203":
          console.log("菜单更新");
          break;
        case "204":
          console.log("头像更新");
          break;
        case "900":
          console.log("语音通话请求");
          break;
        case "901":
          console.log("视频通话请求");
          break;
        case "902":
          console.log("接受通话请求");
          break;
        case "903":
          console.log("拒绝通话请求");
          break;
        case "904":
          console.log("对方设备正忙");
          break;
        case "905":
          console.log("对方结束通话");
          break;
        case "906":
          console.log("取消通话请求");
          break;
        case "907":
          console.log("同步ICE信息");
          break;
        case "908":
          console.log("同步offer信息");
          break;
        case "909":
          console.log("同步answer信息");
          break;
        default:
          console.log("系统错误");
      }
    });
    resolve();
  });
}
export const offline = async (item) => {
  const path = window.location.pathname;
  let applyFriend = {
    action: item.action,
    content: item.content,
    extra: item.extra,
    format: item.format,
    id: item.id,
    receiver: item.receiver,
    sender: item.sender,
    timestamp: item.timestamp,
    title: item.title,
    unread: true,
    status: 0,
  };
  if (path === "/contact/new-friends") applyFriend.unread = false;
  const res = await getUserInfo(item.sender);
  store.commit("user/SET_APPLYFRIEND", { ...applyFriend, ...res.data }); //存储消息
  console.log("离线-加好友请求", item);
};
