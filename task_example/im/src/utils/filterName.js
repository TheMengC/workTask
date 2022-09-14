import store from "../store";
/**
 * filterGroup
 * @param id 获取群信息
 */
export function filterGroup(id) {
  const baseInfo = JSON.parse(store.getters.baseInfo);
  const groupList = baseInfo.groupList || [];
  let array = groupList;
  let info = {};
  array.filter(item => {
    if (item.id == id) {
      info = item;
    }
  });
  return info;
}
/**
 * filterMemberName
 * @param {id, uid, action} 获取通讯录好友信息，以及群好友信息
 */
export function filterMemberName(id, uid, action) {
  if (!id) return {};
  const baseInfo = JSON.parse(store.getters.baseInfo);
  let fri = baseInfo.friendList || [];
  let both = baseInfo.bothList || [];
  let contact = baseInfo.contactList || [];
  const groupList = baseInfo.groupList || [];
  const friendList = [...fri, ...both, ...contact];
  let array = action == "3" ? groupList : friendList;
  let info = null;
  array.filter(item => {
    if (item.id == id) {
      console.log('走到了e');
      if (item.memberList && item.memberList.length > 0) {
        item.memberList.filter(element => {
          if (element.uid == uid) {
            info = element;
          }
        });
      } else {
        info = item;
      }
    }
  });
  if (store.getters.user.id == id) {
    console.log('asdasd');
    info = store.getters.user;
  }
  
  return info ? info : {};
}
