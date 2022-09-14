import Cookies from "js-cookie";

const TokenKey = "access-token";
const UserInfo = "userInfo";
const num = 24; // 失效时间是几小时
const time = new Date(new Date().getTime() + num * 60 * 60 * 1000);
export function getToken() {
    return Cookies.get(TokenKey);
}

export function setToken(token) {
    return Cookies.set(TokenKey, token, {
        expires: time
    });
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}

export function getUserInfo() {
    console.log('getUserInfo', Cookies.get(UserInfo))
    return Cookies.get(UserInfo);
}

export function setUserInfo(userInfo) {
    return Cookies.set(UserInfo, userInfo, {
        expires: time
    });
}

export function removeUserInfo() {
    return Cookies.remove(UserInfo);
}
