import { login, logout, getInfo } from "@/api/login";
import {
    getToken,
    setToken,
    removeToken,
    getUserInfo,
    setUserInfo,
    removeUserInfo
} from "@/utils/auth";
import Cache, { Keys } from "@/utils/cache";

const state = {
    socket: false,
    token: getToken(),
    user: getUserInfo() ? JSON.parse(getUserInfo()) : {},
    baseInfo: Cache.getItem(Keys.baseInfo) || "",
    replyList: [],
    emojList: [],
    fzIcon: localStorage.getItem("offLineFz") || 0,
    fzReply: JSON.parse(localStorage.getItem("fz") || null) || [],
    isUpdate: false,
    applyFriend: [],
    symbolGroup: JSON.parse(localStorage.getItem("symbolGroup") || null) || []
};
const mutations = {
    UPDETA(state, data) {
        state.isUpdate = data;
    },
    SET_FZICON(state, data) {
        state.fzIcon = data;
    },
    SET_FZREPLY(state, data) {
        state.fzReply.push(data);
    },
    DEL_FZREPLY(state, data) {
        state.fzReply = data;
    },
    SET_USER(state, data) {
        setUserInfo(data);
        state.user = data;
    },
    SET_TOKEN(state, data) {
        setToken(data);
        state.token = data;
    },
    SET_BASEINFO: (state, baseInfo) => {
        //
        // 基本信息
        //
        Cache.setItem(Keys.baseInfo, baseInfo);
        if (typeof baseInfo === "object") state.baseInfo = JSON.stringify(baseInfo);
        else state.baseInfo = "";
    },
    SET_REPLYLIST(state, data) {
        // 会话列表
        if (Array.isArray(data)) {
            state.replyList = data;
            Cache.setItem(state.user.id, data);
            return;
        }
        let replyList = JSON.parse(Cache.getItem(state.user.id)) || [];
        replyList = replyList.filter(item => {
            if (item.id != data.id) {
                return item;
            } else {
                if (data.msgList.length === 0) data.msgList = item.msgList;
            }
        });
        data.action == 2 ? replyList.push(data) : replyList.unshift(data);
        state.replyList = replyList;
        console.log('state.user.id, replyList', state.user.id, replyList)
        Cache.setItem(state.user.id, replyList);
    },
    SET_CACHEREPLYLIST(state, data) {
        // 设置回话记录临时缓存0
        state.replyList = data;
    },
    SET_EMOJLIST(state, data) {
        // 设置回话记录临时缓存0
        state.emojList = data;
    },
    REMOVE_SYMBOL(state, id) {
        let i = state.symbolGroup.findIndex(item => item.sender == id);
        if (String(i)) {
            state.symbolGroup.splice(i, 1);
            localStorage.setItem(
                `symbolGroup${state.user.id}`,
                JSON.stringify(state.symbolGroup)
            );
            localStorage.setItem(`symbolGroup`, JSON.stringify(state.symbolGroup));
        }
    },
    //收集@我的群
    SET_SYMBOL(state, data) {
        if (data instanceof Array) {
            state.symbolGroup = data;
            localStorage.setItem(`symbolGroup${state.user.id}`, JSON.stringify(data));
            return;
        }
        let isSome = state.symbolGroup.some(
            item => item.extra == data.extra && item.sender == data.id
        );
        if (!isSome) {
            state.symbolGroup.push(data);
            localStorage.setItem(
                `symbolGroup${state.user.id}`,
                JSON.stringify(state.symbolGroup)
            );
            localStorage.setItem(`symbolGroup`, JSON.stringify(state.symbolGroup));
        }
    },
    SET_APPLYFRIEND(state, data) {
        // 好友请求信息
        if (Array.isArray(data)) {
            state.applyFriend = data;
            Cache.setItem("applyFriend_" + state.user.id, data);
            return;
        }
        let applyFriend =
            JSON.parse(Cache.getItem("applyFriend_" + state.user.id)) || [];
        applyFriend = applyFriend.filter(item => {
            if (item.sender != data.sender) {
                return item;
            }
        });
        applyFriend.unshift(data);
        state.applyFriend = applyFriend;
        Cache.setItem("applyFriend_" + state.user.id, applyFriend);
    }
};

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { telephone, password } = userInfo;
        return new Promise((resolve, reject) => {
            login({ telephone: telephone.trim(), password: password })
                .then(async response => {
                    if (response.code === 200) {
                        commit("SET_TOKEN", response.token);
                        setToken(response.token);
                        commit("SET_USER", response.data);
                        resolve(response.data);
                        let isItem = localStorage.getItem(`symbolGroup${response.data.id}`);
                        if (isItem) {
                            commit("SET_SYMBOL", JSON.parse(isItem));
                            localStorage.setItem("symbolGroup", isItem);
                        } else {
                            commit("SET_SYMBOL", []);
                            localStorage.setItem("symbolGroup", "");
                        }
                        /*
                          登录成功 去缓存symbolGroup+id取值，未找到 symbolGroup 赋值为空数组
                        */
                    } else {
                        reject(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // get user info
    //bothList 组织成员和好友列表
    //contactList 组织成员
    //friendList 好友列表
    //organization // 组织联系人
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token)
                .then(response => {
                    const { code } = response;
                    if (code !== 200) {
                        reject("验证失败，请重新登录。");
                    }
                    const baseInfo = response;
                    commit("SET_BASEINFO", baseInfo);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    // 创建回话列表
    replyList({ commit }, data) {
        console.log('replyList data', data)
        return new Promise(resolve => {
            //
            commit("SET_REPLYLIST", data);
            resolve();
        });
    },
    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token)
                .then(() => {
                    let isItem = localStorage.getItem(`symbolGroup${state.user.id}`);
                    if (!isItem || JSON.parse(isItem).length == 0) {
                        localStorage.removeItem(`symbolGroup${state.user.id}`);
                    }
                    commit("SET_TOKEN", "");
                    commit("SET_USER", "");
                    commit("SET_BASEINFO", "");
                    Cache.removeItem(Keys.baseInfo);
                    removeToken();
                    removeUserInfo();
                    localStorage.removeItem("fzList");
                    resolve();
                    //检测 属于自己的symbolGroup+id 是否还有内容 没有内容就移除\
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit("SET_TOKEN", "");
            commit("SET_USER", {});
            commit("SET_BASEINFO", "");
            removeToken();
            resolve();
        });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
