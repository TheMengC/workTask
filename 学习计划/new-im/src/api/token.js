import Cookie from 'js-cookie'
const day = 1 //有效天数
const expires = new Date(new Date().getTime + day * 24 * 60 * 60 * 1000)

export function getToken() {
    return Cookie.get("token")
}

export function setToken(token) {
    return Cookie.set("token", token, {expires})
}

export function removeToken() {
    return Cookie.remove("token")
}