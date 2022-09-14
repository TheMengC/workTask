// 缓存的Key
export let Keys = {
    baseInfo: "baseInfo",
    isWinMaximize: "isWinMaximize",
    skin: "skin",
    isSideCollapsed: "isSideCollapsed",
    replyList: "replyList"
};
// App缓存数据\
class Cache {
    constructor(params) {
        this.params = params;
    }
    setItem(key, value) {
        try {
            if (typeof value === "object") value = JSON.stringify(value);
            localStorage.setItem(key, value);
        } catch (e) {
            console.log(e);
        }
    }

    getItem(key) {
        return localStorage.getItem(key);
    }

    removeItem(key) {
        return localStorage.removeItem(key);
    }

    /**
     * 登录后的会员信息
     * @return {如果返回null，则需要重新登录}
     */
    user() {
        const user = localStorage.getItem(Keys.user);
        if (user === "" || user === null) {
            return null;
        }
        return user;
    }
}

export default new Cache(Keys);
